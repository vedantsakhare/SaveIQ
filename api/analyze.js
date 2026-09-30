import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.8-flash";

const SYSTEM = `
You are the SaveIQ AI Financial Planning Assistant.

Analyze ONLY the financial data provided by the application.

Return ONLY valid JSON in exactly this structure:

{
  "summary": "string",
  "strengths": ["string", "string"],
  "risks": ["string", "string"],
  "goalInsight": "string",
  "recommendations": ["string", "string"],
  "nextAction": "string"
}

Rules:
- Never invent numbers.
- Use only supplied data.
- Do not guarantee financial outcomes.
- Do not recommend specific investments.
- Give practical savings suggestions.
- Amounts are in Indian Rupees.
- Keep the response concise.
`;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing",
      });
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    if (
      !body ||
      !body.metrics ||
      !Array.isArray(body.goals)
    ) {
      return res.status(400).json({
        error: "Invalid request data",
      });
    }

    const safe = {
      user: body.user || {},
      metrics: body.metrics,
      goals: body.goals.slice(0, 20),
      recentTransactions: Array.isArray(
        body.recentTransactions
      )
        ? body.recentTransactions.slice(0, 15)
        : [],
    };

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const response = await ai.models.generateContent({
      model: MODEL,

      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                SYSTEM +
                "\n\nUSER FINANCIAL DATA:\n" +
                JSON.stringify(safe),
            },
          ],
        },
      ],

      config: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    console.log("Gemini response:", text);

    if (!text) {
      return res.status(502).json({
        error: "Gemini returned an empty response",
      });
    }

    let result;

    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw Gemini response:", text);

      return res.status(502).json({
        error: "Gemini returned invalid JSON",
      });
    }

    return res.status(200).json({
      result,
    });

  } catch (error) {
    console.error("ANALYZE FUNCTION ERROR:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "AI service failed",
    });
  }
}

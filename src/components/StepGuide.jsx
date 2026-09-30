import { useState } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Set up your profile",
    description:
      "Add your basic information and monthly income so SaveIQ can understand your starting point.",
  },
  {
    number: 2,
    title: "Track your expenses",
    description:
      "Add your regular monthly expenses. Keep the numbers realistic so your plan reflects your actual situation.",
  },
  {
    number: 3,
    title: "Create a savings goal",
    description:
      "Choose something you want to save for and decide how much you want to put toward it.",
  },
  {
    number: 4,
    title: "Review your plan",
    description:
      "Check your income, expenses, available savings, and goals together before making changes.",
  },
  {
    number: 5,
    title: "Get AI insights",
    description:
      "Use SaveIQ AI to receive educational suggestions based on the financial information in your plan.",
  },
];

export default function StepGuide({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const nextStep = () => {
    if (isLast) {
      onNavigate?.("home");
      return;
    }

    setCurrentStep((value) => value + 1);
  };

  const previousStep = () => {
    if (currentStep === 0) return;

    setCurrentStep((value) => value - 1);
  };

  return (
    <div className="page guide-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">GET STARTED</p>
          <h1>Build your savings plan</h1>
          <p>
            Follow these simple steps to get the most out of SaveIQ.
          </p>
        </div>

        <button onClick={() => onNavigate?.("home")}>
          Back to Home
        </button>
      </div>

      <div className="guide-card">
        <div className="guide-progress">
          {steps.map((item, index) => (
            <div
              key={item.number}
              className={`progress-step ${
                index <= currentStep ? "completed" : ""
              }`}
            >
              <span>{item.number}</span>
            </div>
          ))}
        </div>

        <div className="guide-content">
          <div className="step-number">
            Step {step.number} of {steps.length}
          </div>

          <h2>{step.title}</h2>

          <p>{step.description}</p>
        </div>

        <div className="guide-actions">
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          <button
            className="primary-button"
            onClick={nextStep}
          >
            {isLast ? "Finish" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}

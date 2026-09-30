SaveIQ — Smart Savings OS

SaveIQ is a modern personal finance dashboard designed to help users track savings goals, monitor transactions, understand financial progress, and receive AI-powered financial insights.

🚀 Live Demo

Production: Deployed with Vercel

✨ Features

📊 Financial dashboard with savings KPIs

🎯 Savings Missions with progress tracking

💰 Transaction management

📈 Financial analytics

🤖 AI-powered financial insights

👤 User profile management

⚙️ Application settings

💾 Persistent browser storage with localStorage

📱 Responsive interface for desktop and mobile

🎨 Modern fintech-inspired UI

🔐 API-based AI integration

🛠️ Tech Stack

React

JavaScript

Vite

CSS

Lucide React

Gemini API

Vercel

GitHub

🧠 AI Financial Copilot

SaveIQ includes an AI-powered financial analysis layer that evaluates:

Savings progress

Financial goals

Recent transactions

Savings behavior

Potential risks

Practical next actions

The AI analysis is presented directly inside the application so users can turn financial data into actionable insights.

📁 Project Structure
src/
├── components/
│   ├── Home.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx
│   └── StepGuide.jsx
├── App.jsx
├── App.css
└── main.jsx

⚡ Getting Started
1. Clone the repository
git clone https://github.com/vedantsakhare/SaveIQ.git
cd SaveIQ

2. Install dependencies
npm install

3. Start the development server
npm run dev

4. Build for production
npm run build

🔑 Environment Variables

Create a .env file for API credentials when required.

Example:

GEMINI_API_KEY=your_api_key_here


Never commit real API keys to GitHub.

💾 Data Persistence

SaveIQ currently uses browser localStorage to persist savings missions and transaction data between sessions.

🎯 Product Goals

SaveIQ is designed around a simple idea:

Make personal finance easier to understand, track, and act on.

The application combines financial tracking, goal management, analytics, and AI assistance into one focused dashboard.

🔮 Future Improvements

Advanced financial charts

User authentication

Cloud database synchronization

Automated recurring transactions

Budget categories

Exportable financial reports

Notifications and goal reminders

More advanced AI financial planning

👨‍💻 Author

Vedant Sakhare

Built as a modern React-based fintech project demonstrating frontend development, application state management, responsive UI design, API integration, and AI-powered features.
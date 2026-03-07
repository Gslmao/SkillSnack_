export const learningData = {
  finance: {
    name: "Finance",
    topics: {
      stock_market: {
        title: "Stock Market",
        lessons: [
          { id: 'f1', title: "What is a Stock?" },           // 5 min
          { id: 'f2', title: "How Exchanges Work" },         // 10 min
          { id: 'f3', title: "Market vs Limit Orders" },     // 15 min
          { id: 'f4', title: "Candlestick Basics" }          // Extra
        ]
      }
    }
  },
  science: {
    name: "Science",
    topics: {
      newtons_laws: {
        title: "Newton's Laws",
        lessons: [
          { id: 's1', title: "First Law: Inertia" },         // 5 min
          { id: 's2', title: "Second Law: F=ma" },           // 10 min
          { id: 's3', title: "Third Law: Action/Reaction" }, // 15 min
          { id: 's4', title: "Gravity & Friction" }          // Extra
        ]
      }
    }
  },
  maths: {
    name: "Maths",
    topics: {
      calculus: {
        title: "Calculus Basics",
        lessons: [
          { id: 'm1', title: "Limits & Continuity" },       // 5 min
          { id: 'm2', title: "The Derivative Concept" },     // 10 min
          { id: 'm3', title: "Power Rule Practice" }         // 15 min
        ]
      }
    }
  }
};
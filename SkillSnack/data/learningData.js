export const learningData = {
  finance: {
    name: "Finance",
    topics: {
      stock_market: {
        title: "Stock Market",
        lessons: [
          { id: 'f1', title: "What is a Stock?", duration: "5" },
          { id: 'f2', title: "How Exchanges Work", duration: "10" },
          { 
            id: 'f3', 
            title: "Market Orders vs Limit Orders", 
            duration: "15" // 40 XP
          },
          
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


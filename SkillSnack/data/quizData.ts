export type Question = {
  question: string;
  options: string[];
  correct: number;
};

export const QUIZ_DATA: Record<string, Question[]> = {
  // FINANCE: STOCK MARKET
  'f1': [
    { question: "What does owning a stock represent?", options: ["A loan to the company", "Ownership in a company", "A government bond", "A bank deposit"], correct: 1 },
    { question: "Why do companies issue stocks?", options: ["To repay debt", "To raise capital", "To pay taxes", "To increase inflation"], correct: 1 },
    { question: "If you buy 100 shares and price rises ₹10, your profit is:", options: ["₹10", "₹100", "₹1,000", "₹10,000"], correct: 2 },
    { question: "Dividends are:", options: ["Taxes paid by investors", "Profit shared with shareholders", "Loan interest", "Government fees"], correct: 1 },
    { question: "Public companies allow:", options: ["Anyone to buy shares", "Only founders to own shares", "Only banks to invest", "Government ownership"], correct: 0 }
  ],
 'f2': [
    { 
      question: "A stock exchange is:", 
      options: ["A bank", "A trading marketplace", "A government agency", "A brokerage firm"], 
      correct: 1 
    },
    { 
      question: "Price discovery means:", 
      options: ["Government setting prices", "Prices determined by supply and demand", "Random price changes", "Fixed prices"], 
      correct: 1 
    },
    { 
      question: "Liquidity means:", 
      options: ["Amount of water in market", "Ease of buying or selling assets", "Tax rate", "Company profit"], 
      correct: 1 
    },
    { 
      question: "Institutional investors include:", 
      options: ["Students", "Mutual funds", "Teachers", "Shop owners"], 
      correct: 1 
    },
    { 
      question: "Exchanges match:", 
      options: ["Buyers and sellers", "Companies and banks", "Governments and investors", "Brokers and regulators"], 
      correct: 0 
    }
  ],
 'f3': [
    { 
      question: "Market orders execute:", 
      options: ["At a fixed price", "Immediately at best price", "After one day", "Only at closing price"], 
      correct: 1 
    },
    { 
      question: "Limit orders allow you to:", 
      options: ["Control price", "Control company profit", "Set dividends", "Set taxes"], 
      correct: 0 
    },
    { 
      question: "If stock price is ₹200 and you set buy limit ₹180:", 
      options: ["Order executes immediately", "Order waits until price hits ₹180", "Order cancels", "Order doubles"], 
      correct: 1 
    },
    { 
      question: "Market orders prioritize:", 
      options: ["Price", "Speed", "Dividends", "Liquidity"], 
      correct: 1 
    },
    { 
      question: "Limit orders may:", 
      options: ["Execute instantly always", "Never execute", "Guarantee profit", "Set company value"], 
      correct: 1 
    }
  ],
 

  // SCIENCE: NEWTON'S LAWS
  's1': [
    { question: "Inertia is the tendency to:", options: ["Speed up", "Change color", "Resist changes in motion", "Fall"], correct: 2 },
    { question: "An object at rest stays at rest unless acted on by:", options: ["A vacuum", "An unbalanced force", "Constant velocity", "Inertia"], correct: 1 }
  ],
  's2': [
    { question: "Newton's Second Law formula:", options: ["E = mc²", "A² + B² = C²", "F = ma", "V = IR"], correct: 2 },
    { question: "If you double the force, acceleration:", options: ["Stays same", "Doubles", "Halves", "Zero"], correct: 1 }
  ],

  // MATHS: CALCULUS
  'm1': [
    { question: "A 'limit' describes behavior:", options: ["At zero", "As it approaches a value", "At infinity", "When broken"], correct: 1 },
    { question: "If a function has no holes, it is:", options: ["Differentiable", "Continuous", "Infinite", "Negative"], correct: 1 }
  ]
};
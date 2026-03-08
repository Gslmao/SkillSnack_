export type VisualStep = {
  id: number;
  title: string;
  desc: string;
  animation?: any;   
  icon?: string;      
};

export type LessonContent = {
  body: string;
  tip: string;
  animation?: any;
  visualSteps?: VisualStep[];
};

export const LESSON_DETAILS_CONTENT: Record<string, LessonContent> = {
  // --- FINANCE MODULES ---
  'f1': {
    animation: require('../assets/animations/trade.json'), 
    body: `**The "Business Pizza" Deal** 

Imagine your friend, Bob, starts a **Pizza Shop**. He has a secret sauce that everyone loves, but he needs ₹10 Lakhs to buy a massive industrial oven and a delivery bike. He doesn't have that kind of cash.

Instead of going to a bank and paying back a boring loan with high interest, he decides to sell **"Slices" of the business.** He divides his shop into 1,000 tiny pieces called **Stocks**.
2
By buying one piece for ₹1,000, you aren't just a customer; you are now a **Partial Owner**. If Bob’s pizza becomes the next big global chain, your tiny ₹1,000 slice could be worth a fortune! When the shop makes a profit at the end of the month, Bob sends a tiny bit of that cash straight to you.`,
    visualSteps: [
      {
        id: 1,
        title: "Price Appreciation",
        desc: "As the shop opens more branches, more people want to own a piece. This demand makes your ₹1,000 slice worth ₹5,000! ",
        animation: require('../assets/animations/profit growth.json')
      },
      {
        id: 2,
        title: "Dividends",
        desc: "Think of this as a 'thank you' bonus. Bob shares the monthly profit with you in actual cash. ",
        animation: require('../assets/animations/Gift Box Lottie Animation.json')
      }
    ],
    tip: "Owning a stock makes you the boss (well, a very tiny boss) of the company!",
  },

  'f2': {
    animation: require('../assets/animations/Receive order.json'), 
    body: `**The Digital Veggie Market** 

A Stock Exchange is basically a high-tech, giant marketplace. Think of it like a local vegetable market (Mandi), but instead of shouting about potatoes and tomatoes, people are shouting about buying pieces of **Apple**, **Google**, or **Tesla**.

In the old days, people actually stood in a room and screamed prices at each other. Today, it’s all done by super-fast computers in milliseconds. The Exchange acts as the **Ultimate Middleman**. It ensures that if you want to sell your 'Pizza Slice', there is a verified buyer waiting, and nobody gets cheated on the price. It’s a 24/7 engine of fairness that keeps the global economy moving.`,
    visualSteps: [
      {
        id: 1,
        title: "Price Discovery",
        desc: "It's like a tug-of-war. If 1,000 people want to buy and only 10 want to sell, the price rockets up instantly! ",
        icon: "stats-chart"
      },
      {
        id: 2,
        title: "Liquidity",
        desc: "Liquidity is how fast you can turn your stock back into cash. In a busy exchange, you can sell in the blink of an eye! ",
        icon: "flashlight"
      }
    ],
    tip: "The exchange acts as a neutral middleman to ensure fairness for everyone.",
  },

  'f3': {
    animation: require('../assets/animations/Speedometer.json'),
    body: `**The "Fast vs. Picky" Orders** 

When you decide to buy a stock, you have to choose your 'shopping style'.

**Market Order (The "I Need it Now" Guy):** You tell the market, "I don't care about the price, just give me that stock immediately!" You get the stock in a fraction of a second, but you might pay ₹102 even if the price was ₹100 a second ago because the market moves so fast.

**Limit Order (The "Bargain Hunter"):** You are picky. You tell the market, "I will only buy this stock if the price hits ₹95 or lower." You might have to wait all day, or the trade might never happen if the price stays high, but you have total control over your money.`,
    visualSteps: [
      {
        id: 1,
        title: "Market Order = Speed",
        desc: "Guarantees your trade happens instantly, but doesn't guarantee the exact price. Best for urgent moves!",
        icon: "flash"
      },
      {
        id: 2,
        title: "Limit Order = Control",
        desc: "Guarantees your price, but doesn't guarantee the trade will ever happen. Best for patient investors!",
        icon: "options"
      }
    ],
    tip: "Use Limit Orders to avoid overpaying when the market is moving fast!",
  },

  's1': {
    animation: require('../assets/animations/trade.json'),
    body: `**The Couch Potato Law** 

Newton's First Law, also known as **Inertia**, basically says that all objects in the universe are fundamentally lazy. If you are curled up on a couch watching Netflix, you will stay there forever unless an "External Force" (like your mom yelling or the house catching fire) makes you move.

The same works in reverse! If you throw a ball in outer space where there is no air or friction, it will keep flying in a straight line at the same speed forever. On Earth, things only stop because 'invisible forces' like air resistance and friction act like a constant brake.`,
    visualSteps: [
      {
        id: 1,
        title: "Objects at Rest",
        desc: "A football on the grass is perfectly happy staying still for 100 years unless someone kicks it. ",
        icon: "stop-circle"
      },
      {
        id: 2,
        title: "Objects in Motion",
        desc: "A puck on ice slides much further because there's less 'friction' trying to be a party pooper!",
        icon: "speedometer"
      }
    ],
    tip: "This is why you lurch forward when a car suddenly brakes—your body wants to keep moving!",
  },

  's2': {
    animation: require('../assets/animations/trade.json'),
    body: `**The "Heavy Push" Rule** 🏗️

Newton's Second Law ($F = ma$) is the math behind every movement. It tells us that Force is a combination of how heavy something is (**Mass**) and how fast you want it to speed up (**Acceleration**).

Think about it: if you want to push a small bicycle, a tiny nudge will send it flying. But if you want to push a massive semi-truck at the same speed, you'd need the strength of an entire army. The heavier the object, the more "oomph" you need to get it going. If you apply the same force to a pebble and a boulder, the pebble will zoom away while the boulder barely flinches.`,
    visualSteps: [
      {
        id: 1,
        title: "Force & Mass",
        desc: "More Mass = More Struggle. If you double the weight, you need double the muscle to keep the same speed! ",
        icon: "barbell"
      }
    ],
    tip: "It's harder to push a heavy truck than a small bicycle because of the mass!",
  },

  'm1': {
    animation: require('../assets/animations/trade.json'),
    body: `**The "Almost There" Rule** 

In Math, **Limits** are the ultimate "tease". They describe what happens when you get infinitely close to a value without ever actually touching it. 

Imagine you are standing 2 meters away from a wall. Every second, you walk half the remaining distance. First you’re 1m away, then 50cm, then 25cm... Mathematically, you will keep getting closer forever, but you will **never** actually hit the wall. A Limit is the number you are 'approaching' as you continue that journey. Without limits, we wouldn't have Calculus, and without Calculus, we wouldn't have modern physics or engineering!`,
    visualSteps: [
      {
        id: 1,
        title: "Infinite Closeness",
        desc: "As you get closer to a point, the gap becomes so small it basically becomes zero. ",
        icon: "calculator"
      }
    ],
    tip: "Limits are the 'gatekeepers' of Calculus; you can't have derivatives without them.",
  }
};
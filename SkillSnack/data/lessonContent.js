export type LessonContent = {
  body: string;
  tip: string;
};

export const LESSON_DETAILS_CONTENT: Record<string, LessonContent> = {
  // FINANCE MODULES ONLY
  'f1': {
    body: `**Concept**
A stock represents partial ownership in a company. When you buy a stock, you are buying a small piece of that business.

Companies issue stocks to raise money. Instead of borrowing from a bank, they sell ownership shares to investors. Investors buy these shares hoping the company will grow and become more valuable.

Each stock is divided into shares. For example:
* If a company has 1 million shares, and you own 1,000 shares, you own 0.1% of the company.

**Why Companies Issue Stocks**
Companies need money to:
* expand operations
* build new products
* hire employees
* enter new markets

By selling stock, they raise capital without needing to repay a loan.

**Why People Buy Stocks**
Investors buy stocks for two main reasons:

**1.Price appreciation**
If the company grows, the stock price may increase.
Example:
* You buy a stock at ₹100
* Later it becomes ₹150
* Your profit = ₹50 per share

**2.Dividends**
Some companies share profits with shareholders.
Example:
* You own 100 shares
* Dividend = ₹5 per share
* You receive ₹500

**Public vs Private Companies**

**Private companies**
* Owned by founders, investors, or private funds
* Shares cannot be bought by the public

**Public companies**
* Shares trade on stock exchanges
* Anyone can buy them

**Example**
Suppose a company called TechNova goes public. They issue 10 million shares at ₹100 each.

Money raised:
10,000,000 x 100 = ₹1,000,000,000

Investors now own parts of the company.

**Key Idea**
Buying stock means:
* You become a partial owner of a company.
* Your wealth grows if the company grows.`,
    tip: "Think of a stock as a 'slice' of a corporate pie. As the pie grows, so does your slice!",
  },
  'f2': {
    body: `Lesson 2 — How Exchanges Work

**Concept**
A stock exchange is a marketplace where stocks are bought and sold. Just like a vegetable market connects buyers and sellers, stock exchanges connect investors and traders. Examples include exchanges in major financial centers around the world.

**Role of the Exchange**
Stock exchanges provide:
• price discovery
• liquidity
• regulation

**1. Price Discovery**
Stock prices change constantly based on supply and demand.
Example:
• More buyers than sellers → price rises
• More sellers than buyers → price falls

**2. Liquidity**
Liquidity means how easily you can buy or sell a stock.
• Highly traded stocks are easy to buy or sell quickly.
• Low liquidity stocks are harder to trade.

**3. Regulation**
Exchanges ensure:
• fair trading
• transparency
• fraud prevention

**Participants in the Market**
Several types of participants trade in stock markets:

**1.Retail investors*
Individuals investing personal money.

**2.Institutional investors**
Large investors like:
• mutual funds
• pension funds
• insurance companies

**3.Market makers**
They provide constant buy/sell quotes to keep trading smooth.

**How a Trade Happens**
When you place an order:

• Order goes to your broker

• Broker sends it to the exchange

• Exchange matches buyer and seller

• Trade executes

**Example:**
• You want to buy 100 shares at ₹200.
• Someone else is selling 100 shares at ₹200.
• The exchange matches both orders.
• Trade complete.

**Key Idea**
The exchange acts like a neutral marketplace that connects buyers and sellers.`,
    tip: "The exchange acts as a middleman to ensure fairness and liquidity.",
  },
  'f3': {
    body: `**Lesson 3 — Market Orders vs Limit Orders**

**Concept**
When buying or selling stocks, you must choose how your order executes. Two common order types:
• Market order
• Limit order

**Market Orders**
A market order buys or sells immediately at the best available price.

**Example:**
• Stock price: Best seller price = ₹200
• If you place a market buy order, your order executes instantly at ₹200.

**Advantages:**
• executes immediately
• simple to use

**Disadvantages:**
• price may change quickly

**Limit Orders**
A limit order lets you choose the exact price you want.

**Example:**
• Current price = ₹200
• You place: Buy limit order = ₹195
• Your order executes only if price reaches ₹195 or lower.

**Advantages:**
• price control
• avoids overpaying

**Disadvantages:**
• order may not execute

**Example Scenario**
You want to buy a stock.
• Market price = ₹100

**Two choices:**

1.Market order: Buy immediately at ₹100

2.Limit order: Buy only if price drops to ₹95

**Key Idea**
• Market order = speed
• Limit order = price control`,
    tip: "Use Limit Orders to avoid 'slippage' where the price jumps before your order finishes.",
  },
 

  // SCIENCE MODULES
  's1': {
    body: "Newton's First Law (Inertia) states that an object will remain at rest or in uniform motion unless acted upon by an external force...",
    tip: "This is why you lurch forward when a car suddenly brakes!",
  },
  's2': {
    body: "The Second Law defines the relationship between Force, Mass, and Acceleration. The formula is F = ma...",
    tip: "It's harder to push a heavy truck than a small bicycle because of the mass!",
  },

  // MATHS MODULES
  'm1': {
    body: "Limits allow us to examine the behavior of a function as it gets infinitely close to a point, even if that point is undefined...",
    tip: "Limits are the 'gatekeepers' of Calculus; you can't have derivatives without them.",
  }
};
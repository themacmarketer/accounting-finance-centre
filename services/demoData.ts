import type { AnalysisResult } from '../types';

export const DEMO_RESULT: AnalysisResult = {
  zScore: 1.05,
  zone: 'distress',
  zScoreModelUsed: "Z''-Score",
  zScoreModelDescription: "The Z''-Score model was selected because the company is a private non-manufacturing entity. This model focuses on book value of equity and removes the sales/asset ratio to minimize industry bias.",
  zScoreModelBenchmarks: {
    distress: "< 1.10",
    caution: "1.10 - 2.60",
    safe: "> 2.60"
  },
  explanation: `### Executive Summary

**Company Overview:** The subject company operates in the Service sector within Singapore. Based on the provided financial statements, the company is facing severe financial headwinds characterized by liquidity crunches, high leverage, and diminishing profitability. 

**Financial Health Assessment:** The calculated Altman Z''-Score is **1.05**, which places the company squarely in the **Distress Zone**. This score is a critical warning sign, indicating a probability of bankruptcy greater than 80% within the next two years if the current financial trajectory is not altered immediately. The company is exhibiting classic signs of financial distress: negative working capital, reliance on short-term debt to fund long-term assets, and thin operating margins.

**Strategic Outlook:** The path forward requires a radical shift in strategy. The company is currently in need of "Surgery"—immediate restructuring to survive. Following stabilization, it must move to "Resuscitation" to revitalize its core business model, and finally to "Nursing" to build long-term resilience. The turnaround plan outlined below utilizes Dr. Michael Teng's methodology to guide this recovery.

### Z-Score Interpretation

The Altman Z''-Score for private non-manufacturing firms is derived from four key ratios. Here is the breakdown of the score of 1.05:

1.  **Working Capital / Total Assets (Weight: 6.56):** This component is negative. The company has more current liabilities than current assets, dragging the score down significantly. This is the single largest contributor to the distress classification.
2.  **Retained Earnings / Total Assets (Weight: 3.26):** This ratio is low, indicating that the company has not accumulated significant reserves over its history, or has eroded them through losses or dividends.
3.  **EBIT / Total Assets (Weight: 6.72):** Earnings Before Interest and Taxes are low relative to the asset base, suggesting inefficient use of resources to generate operating profit.
4.  **Book Value of Equity / Total Liabilities (Weight: 1.05):** The company is highly leveraged, with debt far exceeding equity. This increases financial risk and interest burden.

### Detailed Ratio Analysis

#### 1. Surgery Phase Ratios (Immediate Crisis Management)

*   **Current Ratio: 0.85 (Benchmark: > 1.5)**
    *   *Analysis:* The company has only $0.85 in current assets for every $1.00 of current liabilities. This is a critical liquidity failure. The company cannot meet its short-term obligations without liquidating assets or raising new debt, which is difficult given its leverage.
    *   *Implication:* Immediate cash flow management is the priority.

*   **Debt to Equity Ratio: 2.5 (Benchmark: < 1.5)**
    *   *Analysis:* For every dollar of equity, the company has $2.50 in debt. This level of leverage is dangerous, especially in a rising interest rate environment. It restricts the ability to borrow further for emergency funds.
    *   *Implication:* Deleveraging through asset sales or debt restructuring is mandatory.

*   **Operating Cash Flow Ratio: 0.4 (Benchmark: > 1.0)**
    *   *Analysis:* The company is generating less than half the cash needed to cover its current liabilities from its core operations.
    *   *Implication:* The business model is currently cash-negative in real terms regarding obligations.

*   **Quick Ratio: 0.6 (Benchmark: > 1.0)**
    *   *Analysis:* Excluding inventory, the company's liquidity is even worse. This suggests that a significant portion of current assets is tied up in stock that may not be easily convertible to cash.

*   **Cash Ratio: 0.1 (Benchmark: > 0.5)**
    *   *Analysis:* The company has negligible cash on hand. It is operating "hand-to-mouth," leaving zero buffer for shocks.

#### 2. Resuscitation Phase Ratios (Stabilization)

*   **Return on Assets (ROA): 2.5% (Benchmark: > 5%)**
    *   *Analysis:* The company generates only 2.5 cents of profit for every dollar of assets. This indicates inefficiency in asset utilization.
    *   *Implication:* Assets need to be sweated harder, or unproductive assets must be divested.

*   **Interest Coverage Ratio: 1.2 (Benchmark: > 3.0)**
    *   *Analysis:* EBIT is barely covering interest expenses. A minor drop in earnings will result in default.
    *   *Implication:* Debt servicing costs are suffocating the business.

*   **Inventory Turnover: 4.5x (Benchmark: Industry Avg 6-8x)**
    *   *Analysis:* Inventory is moving slower than industry standards, tying up valuable cash and increasing storage/obsolescence costs.

*   **Receivables Turnover: 6.0x (Benchmark: Industry Avg 8-10x)**
    *   *Analysis:* Customers are paying slower than the industry average. The collection cycle needs tightening.

*   **Working Capital Ratio: Negative Trend**
    *   *Analysis:* The trend analysis over the last 3 years shows a steady decline in working capital, indicating a structural issue rather than a temporary blip.

#### 3. Nursing Phase Ratios (Long-Term Growth)

*   **Return on Equity (ROE): 8% (Benchmark: 12-15%)**
    *   *Analysis:* Shareholders are receiving sub-par returns compared to alternative investments, making it hard to attract new equity investors.

*   **Gross Profit Margin: 35% (Benchmark: 40%)**
    *   *Analysis:* Margins are slightly below average, suggesting pricing power issues or high direct costs.

*   **Asset Turnover Ratio: 0.9 (Benchmark: > 1.2)**
    *   *Analysis:* The company is bloated with assets that are not generating revenue.

*   **Profit Margin: 3% (Benchmark: 8-10%)**
    *   *Analysis:* The bottom line is extremely thin. There is no room for error in pricing or cost control.

*   **Debt Service Coverage Ratio (DSCR): 1.1**
    *   *Analysis:* The company is on the razor's edge of defaulting on its debt obligations.

### Risk Outlook

The financial analysis reveals a company in **Stage 4 Financial Distress**. The primary risks are:
1.  **Insolvency Risk (High):** The immediate threat is running out of cash to pay payroll or critical suppliers within 90 days.
2.  **Operational Risk (Medium):** Inefficiencies in inventory and receivables are exacerbating the cash crunch.
3.  **Strategic Risk (High):** The current business model is not generating sufficient returns to sustain the debt load.

Without the implementation of the Turnaround Plan below, the probability of survival beyond 12 months is low.`,
  turnaroundPlan: [
    {
      title: "Phase I: Surgery (Restructuring)",
      description: "This phase focuses on stopping the bleeding. We must stabilize cash flow immediately through aggressive cost management and asset rationalization.",
      recommendations: [
        {
          title: "Divest Non-Core Assets",
          description: "Immediately identify and liquidate underutilized assets (e.g., excess inventory, unused machinery, non-strategic vehicles) to generate emergency cash and improve the Quick Ratio."
        },
        {
          title: "Restructure Short-Term Debt",
          description: "Engage with lenders to convert short-term obligations into longer-term instruments to relieve pressure on the Current Ratio and improve immediate liquidity."
        },
        {
          title: "Aggressive Overhead Reduction",
          description: "Implement a strict freeze on non-essential spending. Target a 15% reduction in SG&A expenses by renegotiating vendor contracts and reducing discretionary spend."
        }
      ]
    },
    {
      title: "Phase II: Resuscitation (Revitalization)",
      description: "Once stable, we focus on breathing life back into the business by improving operational efficiency and core profitability.",
      recommendations: [
        {
          title: "Pricing & Margin Optimization",
          description: "Review product pricing strategies. Discontinue low-margin SKUs that drag down the Gross Profit Margin and focus sales efforts on high-yield services."
        },
        {
          title: "Tighten Cash Conversion Cycle",
          description: "Implement stricter credit terms for customers to improve Receivables Turnover and adopt Just-In-Time inventory practices to boost Inventory Turnover."
        }
      ]
    },
    {
      title: "Phase III: Nursing (Rehabilitation)",
      description: "The final phase focuses on long-term health, corporate culture, and building a fortress balance sheet.",
      recommendations: [
        {
          title: "Establish Cash Reserves",
          description: "Institute a formal policy to retain 30% of annual net profits to build a 'war chest' (Cash Ratio improvement) to insulate the company against future shocks."
        },
        {
          title: "Cultural Transformation",
          description: "Invest in training and development to foster a culture of financial discipline and ownership among all employees, aligning them with the company's long-term health."
        }
      ]
    }
  ],
  sources: [
    { title: "Singapore Dept of Statistics - Service Industry Benchmarks", uri: "https://www.singstat.gov.sg" },
    { title: "Altman Z-Score Methodology", uri: "https://en.wikipedia.org/wiki/Altman_Z-score" }
  ],
  helpfulResources: [
     { name: 'M&A Centre', url: '#' }, 
     { name: 'Corporate Culture Centre', url: '#' }, 
     { name: 'Turnaround Centre', url: '#' }, 
     { name: 'Transformation Centre', url: '#' }, 
     { name: 'Change Management Centre', url: '#' }, 
     { name: 'Digital AI Centre', url: '#' }, 
     { name: 'Business Model Centre', url: '#' }
  ],
  spiritualPerspective: `### Spiritual Perspectives on Secular Matters

**Scriptural Support**

*   **Connection to Surgery Phase (Restructuring):**
    *   *Recommendation:* Divest Non-Core Assets and Aggressive Cost Cutting.
    *   *Verse:* **Hebrews 12:1** - "Let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us."
    *   *Insight:* In business, as in our spiritual walk, we often accumulate "weight"—unnecessary habits, assets, or practices—that slow us down. The Surgery phase is a time of pruning. It is painful to cut back, but Jesus reminds us in John 15:2 that the Father cuts off every branch that bears no fruit, while every branch that does bear fruit He prunes so that it will be even more fruitful. This restructuring is not an admission of defeat, but a faithful preparation for future fruitfulness.

*   **Connection to Resuscitation Phase (Stabilization):**
    *   *Recommendation:* Optimize Pricing and Improve Utilization.
    *   *Verse:* **Proverbs 27:23** - "Be sure you know the condition of your flocks, give careful attention to your herds."
    *   *Insight:* The Bible calls us to be diligent stewards. Knowing the condition of your "flocks" implies a deep understanding of your business operations, your employees, and your financial data. Resuscitation requires this attention to detail. It is an act of stewardship to ensure that the resources God has entrusted to this business are not wasted but are utilized efficiently to generate value for the community and the Kingdom.

*   **Connection to Nursing Phase (Rehabilitation):**
    *   *Recommendation:* Build Cash Reserves and Cultural Transformation.
    *   *Verse:* **Proverbs 21:20** - "The wise store up choice food and olive oil, but fools gulp theirs down."
    *   *Insight:* Building reserves is biblical wisdom. It is the Joseph principle—saving during times of plenty to survive times of famine. Furthermore, cultural transformation aligns with the renewal of the mind (Romans 12:2). A healthy corporate culture is one that reflects values of integrity, excellence, and care for people, creating a "Nursing" environment where employees and the business grow together in health.

**Prayer**

Our Heavenly Father,

We come before You today lifting up this company, its leadership, and its employees. Lord, the financial indicators before us show a season of distress, a "Z-Score" that warns of danger. We confess that in the busyness of business, we may have sometimes relied on our own strength rather than seeking Your wisdom first. But we acknowledge today that You are Jehovah Jireh, our Provider, and that the earth is Yours and everything in it.

Lord, as the leadership enters this difficult **"Surgery Phase"**, we pray for the courage of David. Give them the strength to make the hard decisions to cut costs and divest assets. Remove the spirit of fear and hesitation. Grant them the discernment to know exactly what is "dead weight" and what is vital for the future. We pray that this pruning process, though painful, would be done with fairness, integrity, and compassion for those affected.

Father, as they move into **"Resuscitation"**, breathe Your breath of life into the operations of this business. We ask for divine favor—favor with creditors, favor with suppliers, and favor with customers. Grant the management team the "wisdom of Solomon" to see creative solutions for pricing, marketing, and efficiency that others might miss. Rebuild the broken walls of this business just as Nehemiah rebuilt Jerusalem, with one hand on the work and one hand trusting in You.

Lord, we look forward with hope to the **"Nursing Phase"**. We pray that this business will not just survive, but thrive. May it become a "city on a hill," a testimony of Your faithfulness and turnaround power. Help them to build a culture that honors You—a culture of integrity, excellence, and generosity. May the profits generated be used to bless families, support the community, and advance Your Kingdom.

We stand on Your promise in **Jeremiah 29:11**, "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future." We claim this hope for this business today. We declare that this financial distress is not the end, but a turning point for a greater beginning.

We commit this turnaround journey into Your hands, trusting that with man this is impossible, but with God all things are possible.

We pray all these in the mighty and matchless name of our Lord and Savior, Jesus Christ, Amen.`
};
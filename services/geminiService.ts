import { GoogleGenAI, Type, Part, Modality, Content } from "@google/genai";
import type { AnalysisResult, AnalysisRequest, Source, Resource, ChatEntry, TrainingScenario } from '../types';
import { decode } from '../utils/audio';
import { DEMO_RESULT } from './demoData';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

const validateAnalysisResult = (data: any): data is AnalysisResult => {
  const hasZScore = typeof data.zScore === 'number';
  const hasZone = data.zone && ['safe', 'caution', 'distress'].includes(data.zone);
  const hasModelUsed = typeof data.zScoreModelUsed === 'string' && data.zScoreModelUsed.length > 0;
  const hasModelDesc = typeof data.zScoreModelDescription === 'string' && data.zScoreModelDescription.length > 0;
  const hasBenchmarks = data.zScoreModelBenchmarks && typeof data.zScoreModelBenchmarks.distress === 'string';
  const hasExplanation = typeof data.explanation === 'string' && data.explanation.length > 0;
  const hasTurnaroundPlan = Array.isArray(data.turnaroundPlan);

  const isValid = hasZScore && hasZone && hasModelUsed && hasModelDesc && hasBenchmarks && hasExplanation && hasTurnaroundPlan;

  if (!isValid) {
      console.error("AI response validation failed. Missing or invalid fields:", {
          hasZScore, hasZone, hasModelUsed, hasModelDesc, hasBenchmarks, hasExplanation, hasTurnaroundPlan,
          receivedData: data,
      });
  }
  
  return isValid;
};


export const getFinancialAnalysis = async (request: AnalysisRequest): Promise<AnalysisResult> => {

  // FAST PATH: Return static data for Demo to simulate server storage
  if (request.isDemo) {
    // Simulate a tiny network delay for realism, or return instantly
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // If secular mode is requested for demo, remove the spiritual perspective
    if (request.guidanceMode === 'secular') {
        const { spiritualPerspective, ...secularResult } = DEMO_RESULT;
        return secularResult;
    }
    return DEMO_RESULT;
  }

  const systemInstruction = `You are an expert in the corporate turnaround methodology of Dr. Michael Teng. This methodology is based on a medical analogy and consists of three phases:
1. **Phase I: Surgery (Restructuring):** Focuses on immediate survival. Key actions include focusing on core competence, cost control, and improving cash flow. This phase requires a surgeon's skill.
2. **Phase II: Resuscitation (Revitalization):** Focuses on growing the business. This involves developing the right product and price, aggressive marketing, and improving service quality to regain market share and profitability.
3. **Phase III: Nursing (Rehabilitation):** Focuses on long-term health by building a strong and healthy corporate immune system. This involves cultivating a new corporate philosophy, fostering a culture of change, and empowering employees.
Your analysis and recommendations must be structured around these three phases. You must also consider internal and external 'corporate viruses' when diagnosing issues.`;
  
  const zScoreInstructions = `
    3.  **Introduce the Altman Z-Score and its variants in your 'Z-Score Interpretation' section.** Explain that different models exist for different types of companies to ensure accuracy.

    4.  **Select and Apply the Correct Altman Z-Score Model:** Use the table below to select the appropriate model based on the user's provided **Industry** and **Company Type**.

        | Model       | Company Type                | Sector            | Equity Basis       | Distress Zone  | Caution Zone      | Safe Zone    |
        |-------------|-----------------------------|-------------------|--------------------|----------------|-------------------|--------------|
        | Z-Score     | Public                      | Manufacturing     | Market Value       | < 1.81         | 1.81 - 2.99       | > 2.99       |
        | Z'-Score    | Private                     | Manufacturing     | Book Value         | < 1.23         | 1.23 - 2.90       | > 2.90       |
        | Z''-Score   | Public or Private           | Non-Manufacturing | Book Value         | < 1.10         | 1.10 - 2.60       | > 2.60       |

        *   **Z-Score Formula:** Z = 1.2A + 1.4B + 3.3C + 0.6D + 1.0E (D = Market Value of Equity / Total Liabilities)
        *   **Z'-Score Formula:** Z' = 0.717A + 0.847B + 3.107C + 0.420D + 0.998E (D = Book Value of Equity / Total Liabilities)
        *   **Z''-Score Formula:** Z" = 6.56A + 3.26B + 6.72C + 1.05D (D = Book Value of Equity / Total Liabilities; E term is removed)

    5.  **Calculate the Z-Score Components:**
        *   Working Capital = Current Assets - Current Liabilities
        *   A = Working Capital / Total Assets
        *   B = Retained Earnings / Total Assets
        *   C = EBIT / Total Assets
        *   D = (Use Market Value or Book Value of Equity as per model) / Total Liabilities
        *   E = Sales / Total Assets (if applicable)
    
    6.  **Determine the Distress Zone:** Based on the score and the thresholds from the table for the chosen model, determine if the company is in the 'safe', 'caution', or 'distress' zone and return this value in the 'zone' field.

    7.  **Return Model Details:** You MUST return the details of the model you used.
        *   Populate 'zScoreModelUsed' with the name of the model (e.g., "Z''-Score").
        *   Populate 'zScoreModelDescription' with a brief explanation of why this model was chosen.
        *   Populate 'zScoreModelBenchmarks' with the specific thresholds for the chosen model (e.g., distress: "< 1.10", caution: "1.10 - 2.60", safe: "> 2.60").
  `;

  try {
    const coreAnalysisPrompt = `
      You are an expert financial analyst and a senior partner at a top-tier business turnaround consultancy, channeling the methodology of Dr. Michael Teng. Your purpose is to provide an exceptionally deep, insightful, and actionable financial health assessment (minimum 3000 words) for Small and Medium Enterprise (SME) owners. Your tone is professional, authoritative, trustworthy, and encouraging.
      
      **USER & COMPANY CONTEXT:**
      *   **User Name:** ${request.userInfo?.name || 'N/A'}
      *   **Industry:** ${request.industry}
      *   **Company Type:** ${request.companyType}
      *   **Country:** ${request.country || 'Singapore'}

      **TASK:**
      1.  **Holistic Document Analysis:** Treat the entire attached PDF document or pasted text as a knowledge base. Understand the company's business model, strategy, and market positioning.

      ${zScoreInstructions}

      8.  **Analyze Key Turnaround Ratios:** You MUST calculate and analyze the following 15 financial ratios, grouped by their relevance to each turnaround phase.
          *   **Surgery Phase Ratios (Immediate Crisis Management):** Current Ratio, Debt to Equity Ratio, Operating Cash Flow Ratio, Quick Ratio, Cash Ratio.
          *   **Resuscitation Phase Ratios (Stabilization):** Return on Assets (ROA), Interest Coverage Ratio, Inventory Turnover Ratio, Receivables Turnover Ratio, Working Capital Ratio.
          *   **Therapy Phase Ratios (Long-Term Growth):** Return on Equity (ROE), Gross Profit Margin, Asset Turnover Ratio, Profit Margin, Debt Service Coverage Ratio (DSCR).

      9.  **Generate Extremely Comprehensive Analysis:** Based on the Z-Score and the 15 ratio analysis, generate a very detailed analysis in Markdown format for the 'explanation' field. This must be a minimum of 3000 words and MUST include these headings: '### Executive Summary', '### Z-Score Interpretation', '### Detailed Ratio Analysis' (with three sub-headings for each phase), and '### Risk Outlook'.
      
      10. **Contextualize Analysis using Web Search:** Throughout your report, explicitly reference the company's industry ('${request.industry}') and country ('${request.country}'). When discussing the 15 key ratios, you MUST use the provided Google Search tool to find the most current industry and country-specific benchmarks for comparison. State the benchmarks you find in your analysis.

      11. **Formulate a Turnaround Plan BASED on the Ratio Analysis:** Structure your recommendations into a comprehensive three-phase plan based on Dr. Michael Teng's methodology. The recommendations in each phase MUST directly address the weaknesses revealed by the 5 specific ratios you analyzed for that phase.

      12. **Populate Helpful Resources:** You MUST populate the 'helpfulResources' field with EXACTLY the following 7 items: [{'name': 'M&A Centre', 'url': '#'}, {'name': 'Corporate Culture Centre', 'url': '#'}, {'name': 'Turnaround Centre', 'url': '#'}, {'name': 'Transformation Centre', 'url': '#'}, {'name': 'Change Management Centre', 'url': '#'}, {'name': 'Digital AI Centre', 'url': '#'}, {'name': 'Business Model Centre', 'url': '#'}].
          
      **FINANCIAL STATEMENTS TEXT (if no file is attached):**
      ---
      ${request.statements}
      ---
    `;

    const analysisResultSchema = {
        type: Type.OBJECT,
        properties: {
            zScore: { type: Type.NUMBER, description: "The calculated Altman Z-Score." },
            zone: { type: Type.STRING, enum: ['safe', 'caution', 'distress'], description: "The financial distress zone." },
            zScoreModelUsed: { type: Type.STRING, description: "The name of the Altman Z-Score model used (e.g., Z''-Score)." },
            zScoreModelDescription: { type: Type.STRING, description: "A brief explanation of why the model was chosen." },
            zScoreModelBenchmarks: {
                type: Type.OBJECT, properties: { distress: { type: Type.STRING }, caution: { type: Type.STRING }, safe: { type: Type.STRING }, }, required: ['distress', 'caution', 'safe']
            },
            explanation: { type: Type.STRING, description: "A detailed analysis in Markdown format (minimum 3000 words)." },
            turnaroundPlan: {
                type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, recommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['title', 'description'] } } }, required: ['title', 'description', 'recommendations'] }
            },
            sources: {
                type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, uri: { type: Type.STRING } }, required: ['title', 'uri'] }
            },
            helpfulResources: {
                type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, url: { type: Type.STRING } }, required: ['name', 'url'] }
            }
        },
        required: ['zScore', 'zone', 'zScoreModelUsed', 'zScoreModelDescription', 'zScoreModelBenchmarks', 'explanation', 'turnaroundPlan', 'sources', 'helpfulResources']
    };

    const analysisContents: (string | Part)[] = [coreAnalysisPrompt];
    if (request.file) {
      const filePart = await fileToGenerativePart(request.file);
      analysisContents.push(filePart);
    }
    
    const analysisResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: analysisContents,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: analysisResultSchema,
      },
      tools: [{ googleSearch: {} }],
    });

    const parsedJson: any = JSON.parse(analysisResponse.text);

    if (!validateAnalysisResult(parsedJson)) {
        throw new Error("The AI returned an incomplete or improperly formatted analysis. Key financial metrics or the turnaround plan might be missing. Please try again.");
    }
    
    const result: AnalysisResult = parsedJson;

    const groundingChunks = analysisResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const searchSources: Source[] = [];
    if (groundingChunks) {
        for (const chunk of groundingChunks) {
            if (chunk.web) {
                searchSources.push({ title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri });
            }
        }
    }

    const foundationalResources: Source[] = [
        { title: 'Corporate Turnaround: Nursing a sick company back to health', uri: '#' },
        { title: 'Business Diagnosis', uri: '#' },
        { title: 'Toolkit: Corporate Transformation to improve productivity and innovation', uri: '#' },
        { title: 'Training Manual: Corporate Turnaround and Transformation Methodology', uri: '#' },
    ];
    
    const allSources = [...(result.sources || []), ...searchSources, ...foundationalResources];
    const uniqueSources = Array.from(new Map(allSources.map(item => [item.uri === '#' ? item.title : item.uri, item])).values());
    result.sources = uniqueSources;
    
    if (request.guidanceMode === 'faith-based') {
        try {
            const zoneImplication = {
                'distress': 'This score indicates a high probability of financial distress and bankruptcy in the near future. The situation requires immediate and drastic action to ensure survival.',
                'caution': 'This score indicates a gray area. The company is facing some financial pressure and could decline into distress if negative trends are not reversed.',
                'safe': 'This score indicates a strong financial position with a low probability of bankruptcy.'
            };
    
            const recommendationText = result.turnaroundPlan.map(phase => 
                `**${phase.title}:**\n${phase.recommendations.map(rec => `- ${rec.title}: ${rec.description}`).join('\n')}`
            ).join('\n\n');
    
            const summaryForPrayer = `
              The company's financial analysis resulted in an Altman Z-Score of ${result.zScore.toFixed(2)}, placing it in the '${result.zone}' zone. 
              **Implication of the Zone:** ${zoneImplication[result.zone]}
    
              The following strategic recommendations have been proposed to address the situation:
              ${recommendationText}
            `;

            const spiritualPrompt = `
              You are a wise, Biblically-grounded Christian business advisor. Your task is to write a section titled '### Spiritual Perspectives on Secular Matters' that provides spiritual encouragement and a prayer based on a company's financial analysis.

              **Analysis Summary & Recommendations:**
              ${summaryForPrayer}

              **Instructions:**
              1.  **Main Heading:** Start with the heading '### Spiritual Perspectives on Secular Matters'.
              2.  **Scriptural Support (Part 1):** Before the prayer, write a section that connects the key secular recommendations to biblical principles. For each of the three turnaround phases (Surgery, Resuscitation, Nursing), pick 1-2 key recommendations from the summary and pair them with a relevant Bible verse and a short paragraph explaining the connection.
              3.  **Prayer Content (Part 2):** After the scriptural support section, write a heartfelt prayer. The prayer text MUST begin with "Our Heavenly Father,".
              4.  **Theological Foundation:** The prayer must be strictly Christian. You MUST use names like God, Jesus Christ, and Holy Spirit.
              5.  **Be Specific and Relevant in Prayer:** The prayer should directly reference the company's situation as described in the summary, including the Z-Score zone and key challenges.
              6.  **Cite Scripture in Prayer:** You MUST incorporate at least one additional Bible verse within the prayer itself for encouragement.
              7.  **Tone:** Empathetic, encouraging, and reverent.
              8.  **Closing:** You MUST end the prayer with the exact phrase: "We pray all these in the name of Jesus Christ, Amen."
              9.  **Length & Format:** The total length should be approximately 750 words. Return ONLY the markdown text.
            `;
            
            const spiritualResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: spiritualPrompt,
            });

            result.spiritualPerspective = spiritualResponse.text;
        } catch (spiritualError) {
            console.error("Error generating faith-based perspective:", spiritualError);
            result.spiritualPerspective = "### Spiritual Perspective Not Available\n\nAn issue occurred while generating the faith-based prayer. The core financial analysis was successful and is available below.";
        }
    }

    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
         throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during the analysis. Please check the console for details.");
  }
};

export const getScenarioRecommendation = async (
  scenario: TrainingScenario, 
  userChoice: string, 
  userInput: string
): Promise<string> => {
  const systemInstruction = `You are an expert business turnaround mentor and AI coach. Your tone is wise, encouraging, and highly practical. You are providing feedback within an interactive training module that follows a detailed financial analysis.`;

  const prompt = `
    **Training Scenario Analysis**

    A business leader is facing the following scenario:
    - **Scenario Title:** "${scenario.title}"
    - **Scenario Description:** "${scenario.description}"
    - **Their Chosen Action:** "${userChoice}"
    - **Additional Context Provided by User:** "${userInput || 'No additional context provided.'}"

    **Your Task:**
    Provide a concise and actionable recommendation based on their choice. Your response must follow this structure:
    1.  **Acknowledge and Validate:** Briefly acknowledge their chosen path.
    2.  **Analysis (Pros & Cons):** Analyze the potential upsides (pros) and downsides (cons) of their chosen action in this specific scenario.
    3.  **Actionable Recommendation:** Provide clear, numbered next steps (2-3 steps) they should take immediately.
    4.  **Guiding Principle:** Conclude with a short, memorable piece of wisdom or a guiding principle relevant to the situation.

    Format your entire response in Markdown. Use headings like "### Analysis" and "### Recommended Next Steps".
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting scenario recommendation:", error);
    return "I'm sorry, I was unable to generate a recommendation at this time. Please try again.";
  }
};

export const getVAAntswer = async (question: string, history: Content[]): Promise<string> => {
  const systemInstruction = `You are a helpful virtual assistant for the Corporate Turnaround Centre, specializing in Dr. Michael Teng's methodologies.
  Your ONLY purpose is to answer questions related to the Centre's services, Dr. Teng's books, and the concepts of corporate turnaround (Surgery, Resuscitation, Nursing), financial health, Altman Z-Score, and the 8 Centres of Excellence.
  Do NOT answer questions outside this scope. If asked about unrelated topics (like the weather, politics, recipes, etc.), politely state that you can only answer questions about corporate turnaround and the services of the Centre.
  Keep your answers concise, helpful, and professional. You are here to guide users, not to perform financial analysis yourself.`;

  try {
    const chat = await ai.chats.create({
      model: "gemini-2.5-flash",
      config: { systemInstruction },
      history,
    });
    const response = await chat.sendMessage({ message: question });
    return response.text;
  } catch (error) {
    console.error("Virtual Assistant Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};

export const getSpeech = async (text: string): Promise<Uint8Array | null> => {
  try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text }] }],
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Zephyr' }, 
                  },
              },
          },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
          return decode(base64Audio);
      }
      return null;
  } catch (error) {
      console.error("Error generating speech:", error);
      return null;
  }
};
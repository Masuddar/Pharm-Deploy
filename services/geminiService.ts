import { GoogleGenAI, Type } from "@google/genai";
import { Sale, Medicine, AnalyticsInsight } from "../types";

// Fix: Initialize GoogleGenAI with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartInsights = async (sales: Sale[], inventory: Medicine[]): Promise<AnalyticsInsight[]> => {
  const prompt = `
    Analyze the following pharmacy sales and inventory data to provide business insights for a clinic/pharmacy owner.
    
    Sales Data Summary: ${JSON.stringify(sales.slice(0, 50))}
    Inventory Data Summary: ${JSON.stringify(inventory.map(i => ({ name: i.name, stock: i.stock, expiry: i.expiryDate })))}
    
    Identify:
    1. Demand forecasting (which medicines will likely run out soon).
    2. Dead stock (medicines not selling).
    3. Expiry risk alerts.
    4. Revenue optimization suggestions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['TREND', 'ALERT', 'OPPORTUNITY'] },
              confidence: { type: Type.NUMBER }
            },
            required: ["title", "description", "type", "confidence"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return [];
  }
};
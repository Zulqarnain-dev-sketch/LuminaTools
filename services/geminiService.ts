import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize specific functionality for specific tools
export const generateKeywords = async (topic: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key provided");
    return ["Error: No API Key configured. Please add your Gemini API Key."];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a list of 10 high-value, low-competition SEO keywords related to the topic: "${topic}". Return only the keywords as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as string[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Error fetching keywords. Please try again later."];
  }
};

import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize safely; actual calls will check for key presence
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const suggestSubtasks = async (taskText: string): Promise<string[]> => {
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return [];
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `Break down the following task into 3 to 5 actionable, concise subtasks: "${taskText}". Return only the list of subtask strings.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    const result = JSON.parse(jsonStr);
    if (Array.isArray(result)) {
        return result;
    }
    return [];

  } catch (error) {
    console.error("Error generating subtasks with Gemini:", error);
    return [];
  }
};
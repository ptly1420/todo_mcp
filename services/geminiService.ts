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
    // Updated prompt to request Chinese output specifically
    const prompt = `请将以下任务拆分为 3 到 5 个可执行的、简洁的子任务："${taskText}"。请仅返回子任务字符串列表（请确保使用中文回答）。`;

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
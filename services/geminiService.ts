import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// Safely handle API key check to prevent runtime crashes in browser
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export const generateEncouragement = async (studentName: string, action: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini");
    return `太棒了，${studentName}！继续保持！`;
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      你是一名小学老师。学生 "${studentName}" 刚刚因为 "${action}" 获得了积分奖励。
      请生成一句简短、充满活力且具体的鼓励语（20字以内）。
      语气要亲切、积极。不要包含引号。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || `做得好，${studentName}！`;
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return `加油，${studentName}！你做得很好！`;
  }
};
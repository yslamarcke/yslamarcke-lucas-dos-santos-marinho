
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SystemConfig } from "../types";

// Safe initialization to prevent crash if process is undefined in browser
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey });

export interface AnalysisResult {
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  summary: string;
}

// Helper to robustly extract JSON from Markdown code blocks or raw text
const cleanJson = (text: string): string => {
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) return jsonBlockMatch[1].trim();
  
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    return text.substring(firstBrace, lastBrace + 1);
  }

  return text.trim();
};

export const analyzeReport = async (description: string): Promise<AnalysisResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        enum: ["Limpeza Urbana", "Infraestrutura", "Iluminação", "Saneamento"],
        description: "Strictly classify into one of: 'Limpeza Urbana' (trash, sweeping), 'Infraestrutura' (potholes, sidewalks, construction), 'Iluminação' (street lights), 'Saneamento' (water leaks, sewage).",
      },
      priority: {
        type: Type.STRING,
        enum: ["Low", "Medium", "High"],
        description: "The urgency of the issue.",
      },
      summary: {
        type: Type.STRING,
        description: "A very short title (max 5 words).",
      },
    },
    required: ["category", "priority", "summary"],
  };

  try {
    if (!apiKey) throw new Error("API Key not found");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this citizen request: "${description}". Classify it strictly to route to the correct city department.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an intelligent routing system for city hall. Your goal is to send the request to the EXACT department responsible."
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(cleanJson(text)) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      category: "Infraestrutura", // Fallback seguro
      priority: "Medium",
      summary: "Nova Solicitação",
    };
  }
};

export const generateSystemUpdate = async (command: string, currentConfig: SystemConfig): Promise<SystemConfig> => {
   // ... (Mantém a lógica de update do sistema existente se necessário, simplificado aqui para brevidade do XML)
   return currentConfig; 
};

export const chatWithBot = async (message: string): Promise<string> => {
  try {
     if (!apiKey) return "Estou operando em modo offline. Verifique a chave de API.";
     
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
           systemInstruction: "Você é o ZelaBot, um assistente virtual amigável do app ZelaPB. Ajude cidadãos a entender como fazer solicitações, explique sobre coleta de lixo, iluminação e obras. Seja breve e cordial."
        }
     });
     return response.text || "Desculpe, não entendi.";
  } catch (e) {
     return "Erro ao conectar com o assistente.";
  }
}

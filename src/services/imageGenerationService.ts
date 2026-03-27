import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "../lib/env";

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  throw new Error("AI Image generation is disabled.");
};

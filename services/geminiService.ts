import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the legal case, highlighting the key points, parties involved, and the core legal issue.",
    },
    category: {
      type: Type.STRING,
      enum: ['Criminal', 'Civil', 'Constitutional', 'Corporate', 'Family', 'Tax', 'Other'],
      description: "The primary legal category this case falls under.",
    },
    priority: {
      type: Type.STRING,
      enum: ['Urgent', 'High', 'Medium', 'Low'],
      description: "The assessed priority label for this case based on its nature and potential impact.",
    },
    priorityScore: {
      type: Type.INTEGER,
      description: "A numerical priority score from 1 to 100, where 100 is the most urgent. The score must be based on a strict evaluation of urgency factors.",
    },
    priorityJustification: {
      type: Type.STRING,
      description: "A brief, critical justification for the assigned priority score, explaining the specific factors that make the case urgent (e.g., 'Involves senior citizen plaintiff', 'Impacts public health access').",
    },
    preliminaryAssessment: {
      type: Type.STRING,
      description: "A brief, neutral preliminary assessment of the case based on the provided text. This should outline potential legal arguments, strengths, or weaknesses for either side, without declaring a definitive winner or offering legal advice.",
    },
    fastTrack: {
        type: Type.BOOLEAN,
        description: "Set to true if the case involves sensitive matters like sexual assault, offenses against children (POCSO), or terrorism, requiring immediate fast-tracking. Otherwise, set to false."
    },
    fastTrackJustification: {
        type: Type.STRING,
        description: "If 'fastTrack' is true, provide a brief, clear justification (e.g., 'Case filed under POCSO Act'). If false, return an empty string."
    }
  },
  required: ['summary', 'category', 'priority', 'priorityScore', 'priorityJustification', 'preliminaryAssessment', 'fastTrack', 'fastTrackJustification'],
};


export const analyzeCase = async (caseText: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      You are an AI specialist in judicial backlog management for the Indian legal system. Your task is to analyze legal case documents with extreme prejudice towards identifying and prioritizing the most critical cases.

      Analyze the following document and return a structured JSON analysis. The priority assessment and fast-track identification are the most crucial parts of your task.

      **CRITICAL PRIORITY GUIDELINES:**
      - **Urgent (Score 90-100):** Cases involving fundamental rights (Article 14, 19, 21), matters of national security, public health crises, major environmental threats, criminal appeals against acquittal for heinous crimes, or cases involving vulnerable individuals (senior citizens, women, children). Includes all Fast-Track cases.
      - **High (Score 70-89):** High-value economic disputes, significant IP challenges, major infrastructure project disputes, and public interest litigations with wide-reaching implications.
      - **Medium (Score 40-69):** Standard civil suits, contractual disputes, service matters, and less severe criminal matters.
      - **Low (Score 1-39):** Procedural appeals, routine matters, or cases with low impact.

      **FAST-TRACK IDENTIFICATION:**
      - You MUST identify cases that require mandatory fast-tracking.
      - Set 'fastTrack' to true if the case involves:
        - Sexual offenses (rape, assault).
        - Offenses under the Protection of Children from Sexual Offences (POCSO) Act.
        - Cases related to terrorism or national security.
      - If 'fastTrack' is true, its priority score MUST be 90 or above. Provide a clear 'fastTrackJustification'.

      Assign a precise 'priorityScore' from 1-100. The 'priorityJustification' must be a direct and concise reason for the score.

      Case Document:
      ---
      ${caseText}
      ---

      Return ONLY the JSON object.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as AnalysisResult;
    return parsedResult;

  } catch (error) {
    console.error("Error analyzing case with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze case: ${error.message}`);
    }
    throw new Error("An unknown error occurred during case analysis.");
  }
};
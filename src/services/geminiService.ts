import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface HealthProvider {
  name: string;
  location: string;
  specialty: string;
  rating: number;
  image: string;
  description: string;
}

export async function discoverHealthcare(query: string): Promise<HealthProvider[]> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for top healthcare providers (hospitals, diagnostic centers, etc.) based on this query: "${query}". 
      If the query is generic, suggest the best global options. 
      If the query specifies a region (like Thailand, UAE, India), suggest top providers in that region.
      Return a list of 3 high-quality, reputable providers.`,
      config: {
        systemInstruction: "You are a specialized healthcare medical tourism consultant. Provide realistic and reputable medical providers. Format as JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              specialty: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              image: { type: Type.STRING, description: "A high-quality Unsplash image URL related to medical/hospital" },
              description: { type: Type.STRING }
            },
            required: ["name", "location", "specialty", "rating", "image"]
          }
        }
      }
    });

    if (!response.text) return [];
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Discovery Error:", error);
    return [];
  }
}

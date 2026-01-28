
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ManagerId, Message, Attachment, Language } from "../types";
import { getSystemInstruction } from "../constants";

export const getManagerResponse = async (
  managerId: ManagerId,
  history: Message[],
  userInput: string,
  language: Language,
  userImage?: { data: string, mimeType: string }
): Promise<{ messages: { managerId: ManagerId, text: string, attachments: Attachment[] }[] }> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return {
      messages: [{ 
        managerId, 
        text: language === 'bn' ? "API Key missing." : "API Key missing.", 
        attachments: [] 
      }]
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = getSystemInstruction(managerId, language);
  const isMeeting = managerId === ManagerId.MEETING_ROOM;
  const modelName = isMeeting ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  const contents: any[] = [];
  history.slice(-15).forEach(m => {
    contents.push({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || " " }]
    });
  });

  const currentParts: any[] = [{ text: userInput || " " }];
  if (userImage) {
    currentParts.push({
      inlineData: { data: userImage.data, mimeType: userImage.mimeType }
    });
  }
  contents.push({ role: 'user', parts: currentParts });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        responseMimeType: isMeeting ? "application/json" : "text/plain",
        ...(isMeeting && {
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                managerId: {
                  type: Type.STRING,
                  description: 'The specific manager ID responding.',
                },
                text: {
                  type: Type.STRING,
                  description: 'The response text for that manager.',
                },
              },
              required: ["managerId", "text"],
              propertyOrdering: ["managerId", "text"],
            },
          },
        }),
      }
    });

    const rawText = response.text || "";

    if (isMeeting) {
      try {
        const groupReplies = JSON.parse(rawText);
        return {
          messages: groupReplies.map((r: any) => {
            const { cleanText, attachments } = parseVisuals(r.text);
            return {
              managerId: r.managerId as ManagerId,
              text: cleanText,
              attachments
            };
          })
        };
      } catch (e) {
        const { cleanText, attachments } = parseVisuals(rawText);
        return { messages: [{ managerId: ManagerId.SENIOR_DYEING_MANAGER, text: cleanText, attachments }] };
      }
    }

    const { cleanText, attachments } = parseVisuals(rawText);
    return {
      messages: [{ managerId, text: cleanText, attachments }]
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      messages: [{ 
        managerId, 
        text: language === 'bn' ? "সার্ভারে সমস্যা হচ্ছে।" : "Connecting to factory servers...", 
        attachments: [] 
      }]
    };
  }
};

function parseVisuals(text: string) {
  let cleanText = text;
  const attachments: Attachment[] = [];

  // Parse visual charts - using [\s\S] to handle multi-line JSON
  const chartRegex = /\[VISUAL_DATA:\s*({[\s\S]*?})\s*\]/g;
  let chartMatch;
  while ((chartMatch = chartRegex.exec(cleanText)) !== null) {
    try {
      attachments.push({ type: 'chart', data: JSON.parse(chartMatch[1]) });
      cleanText = cleanText.replace(chartMatch[0], "");
    } catch (e) {
      console.error("Chart parse error:", e);
    }
  }

  // Parse image references
  const refRegex = /\[VISUAL_REF:\s*({[\s\S]*?})\s*\]/g;
  let refMatch;
  while ((refMatch = refRegex.exec(cleanText)) !== null) {
    try {
      const refConfig = JSON.parse(refMatch[1]);
      const keyword = refConfig.keyword || "textile factory";
      attachments.push({ 
        type: 'image', 
        url: `https://loremflickr.com/800/600/${encodeURIComponent(keyword.replace(/\s+/g, ','))}`
      });
      cleanText = cleanText.replace(refMatch[0], "");
    } catch (e) {
      console.error("Ref parse error:", e);
    }
  }

  // Clean up any double spaces or remaining brackets
  cleanText = cleanText.replace(/\s+/g, ' ').trim();

  return { cleanText, attachments };
}


import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DreamInterpretation } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "꿈에 대한 상징적인 제목 (A symbolic title for the dream).",
    },
    summary: {
      type: Type.STRING,
      description: "꿈에 대한 종합적인 해석. 가독성을 위해 이모티콘과 두 번의 줄바꿈을 사용합니다. (A comprehensive interpretation of the dream, formatted with emojis and double line breaks for readability).",
    },
    positive_aspects: {
      type: Type.STRING,
      description: "꿈의 긍정적인 의미나 길조. 가독성을 위해 이모티콘과 두 번의 줄바꿈을 사용합니다. (Positive meanings or good omens from the dream, formatted with emojis and double line breaks for readability).",
    },
    advice: {
      type: Type.STRING,
      description: "꿈을 바탕으로 한 조언이나 나아갈 방향. 가독성을 위해 이모티콘과 두 번의 줄바꿈을 사용합니다. (Advice or direction based on the dream, formatted with emojis and double line breaks for readability).",
    },
  },
  required: ["title", "summary", "positive_aspects", "advice"],
};


export const getDreamInterpretation = async (dreamDescription: string): Promise<DreamInterpretation> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `다음 꿈 내용을 해석해주세요: "${dreamDescription}"`,
      config: {
        systemInstruction: "당신은 'AI 해몽가'입니다. 한국의 전통적인 꿈 상징과 심리학적 분석을 바탕으로 사용자에게 꿈 해몽을 제공해주세요. 모든 답변은 '~했어요', '~인 것 같아요', '~라고 할 수 있어요'와 같이 부드럽고 친근한 한국어(해요체)로 작성해주세요. 해석은 반드시 제목, 종합 해석, 긍정적 측면, 조언의 4가지 파트로 나누어 설명해주십시오. '종합 해석', '긍정적 신호', '삶의 조언' 파트의 내용은 가독성을 높이기 위해, 각 문장이나 핵심 포인트 앞에 관련된 이모티콘(예: ✨, 💡, 🙏)을 붙이고, 각 문장 뒤에는 두 번의 줄바꿈(\\n\\n)을 넣어 문단 사이의 간격을 넓혀주십시오.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const jsonText = response.text.trim();
    const interpretation: DreamInterpretation = JSON.parse(jsonText);
    return interpretation;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("꿈 해몽 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};
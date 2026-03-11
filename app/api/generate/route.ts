import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const developerPrompt = `
你是一位專業 SEO 內容編輯，擅長根據指定關鍵字撰寫結構清楚、可讀性高的文章。
請使用使用者指定的語言與語氣。
輸出格式必須是 JSON。
不要輸出 JSON 以外的任何內容。
如果資訊不足，仍需依現有資訊完成合理輸出。
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, language, style, length } = body;

    // 驗證必要欄位
    if (!keyword || !language || !style || !length) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    // 驗證參數值
    if (!["zh", "en"].includes(language)) {
      return NextResponse.json({ error: "不支援的語言" }, { status: 400 });
    }

    if (!["professional", "friendly", "tutorial"].includes(style)) {
      return NextResponse.json({ error: "不支援的風格" }, { status: 400 });
    }

    if (!["short", "medium", "long"].includes(length)) {
      return NextResponse.json({ error: "不支援的長度" }, { status: 400 });
    }

    const userPrompt = `
請根據以下參數生成一篇關於 "${keyword}" 的文章：
- 語言: ${language === "zh" ? "中文" : "英文"}
- 風格: ${style}
- 長度: ${length}
    `;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "developer",
          content: developerPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const processedArticle = response.output_text;

    return NextResponse.json({
      success: true,
      data: {
        article: processedArticle,
        keyword,
        language,
        style,
        length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "生成文章時發生錯誤" }, { status: 500 });
  }
}

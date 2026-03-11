export type Language = "zh" | "en";
export type Style = "professional" | "friendly" | "tutorial";
export type Length = "short" | "medium" | "long";

export interface GenerateArticleRequest {
  keyword: string;
  language: Language;
  style: Style;
  length: Length;
}

export interface GenerateArticleResponse {
  success: boolean;
  data: {
    article: string;
    keyword: string;
    language: Language;
    style: Style;
    length: Length;
    generatedAt: string;
  };
}

export async function generateArticle(
  data: GenerateArticleRequest
): Promise<GenerateArticleResponse> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "生成文章失敗");
  }

  return response.json();
}

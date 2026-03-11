"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateArticle } from "@/lib/api";
import type { Language, Style, Length } from "@/lib/api";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const keyword = searchParams.get("keyword") || "AI";
  const language = (searchParams.get("language") || "zh") as Language;
  const style = (searchParams.get("style") || "professional") as Style;
  const length = (searchParams.get("length") || "medium") as Length;

  // 使用 useQuery 獲取文章
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["article", keyword, language, style, length],
    queryFn: () =>
      generateArticle({
        keyword,
        language,
        style,
        length,
      }),
    staleTime: 5 * 60 * 1000, // 5 分鐘內不重新 fetch
  });

  const article = data?.data.article || "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(article);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("複製失敗，請重試");
    }
  };

  const handleRegenerate = () => {
    // 使 cache 失效並重新 fetch
    queryClient.invalidateQueries({
      queryKey: ["article", keyword, language, style, length],
    });
    refetch();
  };

  const handleNewArticle = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <button
            onClick={handleNewArticle}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-4"
          >
            <span>←</span>
            <span>返回首頁</span>
          </button>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">關鍵字：</span>
              <span className="font-semibold text-gray-900">{keyword}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">語言：</span>
              <span className="font-semibold text-gray-900">
                {language === "zh" ? "中文" : "English"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">風格：</span>
              <span className="font-semibold text-gray-900">
                {style === "professional"
                  ? "專業"
                  : style === "friendly"
                    ? "親切"
                    : "教學"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">長度：</span>
              <span className="font-semibold text-gray-900">
                {length === "short" ? "短" : length === "medium" ? "中" : "長"}
              </span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Action Bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">生成結果</h2>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copied ? "已複製！" : "複製 Markdown"}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="px-4 py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                重新生成
              </button>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-gray-600">正在生成文章...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="text-red-600 text-xl">⚠️</div>
                <p className="text-red-600">
                  {error instanceof Error ? error.message : "載入文章時發生錯誤"}
                </p>
                <button
                  onClick={handleRegenerate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  重試
                </button>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                  {article}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="max-w-4xl mx-auto mt-6 flex justify-center">
          <button
            onClick={handleNewArticle}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            生成新文章
          </button>
        </div>
      </div>
    </div>
  );
}

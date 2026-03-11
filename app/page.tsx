"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { generateArticle } from "@/lib/api";
import type { GenerateArticleRequest } from "@/lib/api";

const formSchema = z.object({
  keyword: z.string().min(1, "請輸入關鍵字"),
  language: z.enum(["zh", "en"]),
  style: z.enum(["professional", "friendly", "tutorial"]),
  length: z.enum(["short", "medium", "long"]),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "zh",
      style: "professional",
      length: "medium",
    },
  });

  const mutation = useMutation({
    mutationFn: generateArticle,
    onSuccess: (data, variables) => {
      // 導向結果頁，並帶上參數
      const params = new URLSearchParams({
        keyword: variables.keyword,
        language: variables.language,
        style: variables.style,
        length: variables.length,
      });

      router.push(`/result?${params.toString()}`);
    },
    onError: (error: Error) => {
      alert(error.message || "生成文章時發生錯誤，請重試");
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("表單資料：", data);
    mutation.mutate(data as GenerateArticleRequest);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI 文章生成器
          </h1>
          <p className="text-xl text-gray-600">
            輸入關鍵字，讓 AI 為你生成高品質文章
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 關鍵字輸入 */}
            <div>
              <label
                htmlFor="keyword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                關鍵字
              </label>
              <input
                {...register("keyword")}
                type="text"
                id="keyword"
                placeholder="例如：人工智慧、區塊鏈、永續發展"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.keyword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.keyword.message}
                </p>
              )}
            </div>

            {/* 語言選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                語言
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    {...register("language")}
                    type="radio"
                    value="zh"
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">中文</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register("language")}
                    type="radio"
                    value="en"
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">English</span>
                </label>
              </div>
            </div>

            {/* 文章風格 */}
            <div>
              <label
                htmlFor="style"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                文章風格
              </label>
              <select
                {...register("style")}
                id="style"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="professional">專業</option>
                <option value="friendly">親切</option>
                <option value="tutorial">教學</option>
              </select>
            </div>

            {/* 文章長度 */}
            <div>
              <label
                htmlFor="length"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                文章長度
              </label>
              <select
                {...register("length")}
                id="length"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="short">短（約 200 字）</option>
                <option value="medium">中（約 500 字）</option>
                <option value="long">長（約 1000 字）</option>
              </select>
            </div>

            {/* 產生按鈕 */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? "生成中..." : "生成文章"}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {mutation.isPending && (
          <div className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600">AI 正在生成文章，請稍候...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

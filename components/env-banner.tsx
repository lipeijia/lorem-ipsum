"use client";

import { isUAT, showDebugTools, envName } from "@/lib/env";

export function EnvBanner() {
  // 只在 UAT 環境顯示
  if (!isUAT) {
    return null;
  }

  return (
    <>
      {/* UAT 環境標籤 - 固定在頂部 */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black px-4 py-2 text-sm font-bold z-50 text-center shadow-md">
        🔧 UAT 測試環境 | {envName.toUpperCase()}
      </div>

      {/* 調試信息 - 固定在右下角 */}
      {showDebugTools && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs space-y-2 z-50 max-w-xs">
          <div className="font-bold text-yellow-400 mb-2">🛠️ Debug Info</div>
          <div className="space-y-1 opacity-90">
            <p>
              <span className="text-gray-400">環境:</span> {envName}
            </p>
            <p>
              <span className="text-gray-400">Node ENV:</span>{" "}
              {process.env.NODE_ENV}
            </p>
            <p>
              <span className="text-gray-400">API Key:</span>{" "}
              {process.env.OPENAI_API_KEY?.slice(0, 15) || "未設置"}...
            </p>
            <p className="text-gray-400 text-[10px] mt-2">
              此信息僅在 UAT 環境顯示
            </p>
          </div>
        </div>
      )}
    </>
  );
}

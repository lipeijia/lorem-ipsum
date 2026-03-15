// 環境檢測工具
export const isUAT = process.env.NEXT_PUBLIC_ENV === 'uat';
export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const showDebugTools = process.env.NEXT_PUBLIC_SHOW_DEBUG === 'true';

// 環境名稱
export const envName = process.env.NEXT_PUBLIC_ENV || 'unknown';

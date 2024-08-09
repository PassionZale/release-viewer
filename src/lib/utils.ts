import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BaseResponse } from "@/types/interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class ApiResponse implements BaseResponse {
  code: number;

  data: any;

  message: string;

  timestamp: number;

  constructor(data: unknown = null, message?: string, code?: number) {
    this.code = code || 0;
    this.data = data || null;
    this.message = message || "操作成功";
    this.timestamp = +new Date();
  }
}

export class ApiException extends ApiResponse implements BaseResponse {
  constructor(errorMessage?: string, errorCode?: number, errorData?: unknown) {
    const code = errorCode || -1;
    const data = errorData || null;
    const message = errorMessage || "网络开小差";

    super(data, message, code);
  }
}

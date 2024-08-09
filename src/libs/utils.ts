import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BaseResponse } from "@/types/interface";
import { ApiCode } from "@/types/enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class ApiResponse implements BaseResponse {
  code: ApiCode;

  data: any;

  message: string;

  timestamp: number;

  constructor(data: unknown = null, message?: string, code?: ApiCode) {
    this.code = code || ApiCode.SUCCESS;
    this.data = data || null;
    this.message = message || "操作成功";
    this.timestamp = +new Date();
  }
}

export class ApiException extends ApiResponse implements BaseResponse {
  constructor(errorMessage?: string, errorCode?: ApiCode, errorData?: unknown) {
    const code = errorCode || ApiCode.FAIL;
    const data = errorData || null;
    const message = errorMessage || "网络开小差";

    super(data, message, code);
  }
}

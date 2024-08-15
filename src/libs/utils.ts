import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";
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

  error?: ZodIssue[];

  constructor(
    data: unknown = null,
    message?: string,
    code?: ApiCode,
    error?: ZodIssue[]
  ) {
    this.code = code || ApiCode.SUCCESS;
    this.data = data || null;
    this.error = error;
    this.message = message || "操作成功";
    this.timestamp = +new Date();
  }
}

export class ApiException extends ApiResponse implements BaseResponse {
  issues?: ZodIssue[];

  constructor(
    messageOrIssues?: string | ZodIssue[],
    code?: ApiCode,
    issues?: ZodIssue[]
  ) {
    if (Array.isArray(messageOrIssues)) {
      super(
        null,
        messageOrIssues[0].message || "网络开小差",
        code || ApiCode.FAIL,
        messageOrIssues
      );
    } else {
      super(
        null,
        messageOrIssues || "网络开小差",
        code || ApiCode.FAIL,
        issues
      );
    }
  }
}

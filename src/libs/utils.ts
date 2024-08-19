import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";
import { BaseResponse, Pagination } from "@/types/interface";
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

  meta?: {
    pagination: Pagination;
  };

  constructor(
    data: any = null,
    message?: string,
    code?: ApiCode,
    error?: ZodIssue[]
  ) {
    this.code = code || ApiCode.SUCCESS;

    if (data?.meta) {
      const { records, meta } = data;

      this.data = records;
      this.meta = meta;
    } else {
      this.data = data || null;
    }

    this.message = message || "操作成功";
    this.error = error;
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

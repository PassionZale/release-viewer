import { NextRequest, NextResponse } from "next/server";
import { ZodIssue } from "zod";
import type { Prisma, PrismaClient } from "@prisma/client";
import { Actions, ApiCode } from "./enum";

export type ModelNames = Prisma.ModelName; // "User" | "App" | etc...
// export type ModelNames =
//   (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<M>]["findUnique"]>>,
    null
  >;
};

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface BaseResponse<T = any> {
  code: ApiCode;
  data: T;
  message: string;
  error?: ZodIssue[];
  meta?: {
    pagination: Pagination;
  };
  timestamp: number;
}

export type Params = {
  [key: string]: string | string[];
};

export interface ContextRequest extends NextRequest {
  auth?: {
    user?: Omit<PrismaModels["User"], "hashedPassword">;
  };
}

export interface ContextResponse<P> extends NextResponse {
  params: P;
}

export type DetailPageSlug = [Actions.CREATE] | [Actions.EDIT, string];

import { NextRequest, NextResponse } from "next/server";
import { ZodIssue } from "zod";
import type { Prisma, PrismaClient } from "@prisma/client";
import { ApiCode } from "./enum";
import { useParams } from "next/navigation";

type ModelNames = Prisma.ModelName; // "User" | "App" | etc...

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<M>]["findUnique"]>>,
    null
  >;
};

export interface BaseResponse<T = any> {
  code: ApiCode;
  data: T;
  message: string;
  error?: ZodIssue[];
  meta?: any; // TODO pagination
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

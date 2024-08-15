import { NextRequest } from "next/server";
import { ZodIssue } from "zod"
import type { Prisma, PrismaClient } from "@prisma/client";
import { ApiCode } from "./enum";

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
	error?: ZodIssue[]
	meta?: any // TODO pagination
  timestamp: number;
}

export interface ContextRequest extends NextRequest {
  auth?: {
    user?: Omit<PrismaModels["User"], "hashedPassword">;
  };
}

import { ApiCode } from "./enum";

export interface BaseResponse<T = any> {
  code: ApiCode;
  data: T;
  message: string;
  timestamp: number;
}

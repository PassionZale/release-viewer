import { ApiCode } from "@/types/enum";
import { BaseResponse } from "@/types/interface";
import qs from "qs";
import { ApiException } from "./utils";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Params {
  cacheTime?: number; //缓存时间，单位为s。默认强缓存，0为不缓存
  params?: Record<string, any>;
}

interface Props extends Params {
  url: string;
  method: Method;
}

type Config =
  | { next: { revalidate: number } }
  | { cache: "no-store" }
  | { cache: "force-cache" };

export class Request {
  /**
   * 请求拦截器
   */
  interceptorsRequest({ url, method, params, cacheTime = 0 }: Props) {
    let queryParams = "";
    let requestPayload = "";

    // 默认请求头
    const headers = {};

    const config: Config =
      cacheTime || cacheTime === 0
        ? cacheTime > 0
          ? { next: { revalidate: cacheTime } }
          : { cache: "no-store" }
        : { cache: "force-cache" };

    if (method === "GET" || method === "DELETE") {
      if (params) {
        queryParams = qs.stringify(params, { arrayFormat: "brackets" });
        url = `${url}?${queryParams}`;
      }
    } else {
      // 非form-data传输JSON数据格式
      if (
        !["[object FormData]", "[object URLSearchParams]"].includes(
          Object.prototype.toString.call(params)
        )
      ) {
        Object.assign(headers, { "Content-Type": "application/json" });
        requestPayload = JSON.stringify(params);
      }
    }
    return {
      url,
      options: {
        method,
        headers,
        body:
          method !== "GET" && method !== "DELETE" ? requestPayload : undefined,
        ...config,
      },
    };
  }

  /**
   * 响应拦截器
   */
  interceptorsResponse<T>(res: Response): Promise<BaseResponse<T>> {
    return new Promise(async (resolve, reject) => {
      const requestUrl = res.url;
      if (res.ok) {
        const result: BaseResponse<T> = await res.json();

        if (result.code === ApiCode.SUCCESS) {
          resolve(result);
        } else {
          reject(result);
        }
      } else {
        res
          .clone()
          .text()
          .then((text) => {
            if (res.status === 404) {
              return reject(new ApiException(`${requestUrl} 404 Not Found`));
            }

            try {
              const message = JSON.parse(text);

              return reject(new ApiException(`${requestUrl} ${message}`));
            } catch {
              return reject(new ApiException(`${requestUrl} ${text}`));
            }
          });
      }
    });
  }

  async httpFactory<T>({
    url = "",
    params = {},
    method,
  }: Props): Promise<BaseResponse<T>> {
    const req = this.interceptorsRequest({
      url: process.env.NEXT_PUBLIC_API_BASEURL + url,
      method,
      params: params.params,
      cacheTime: params.cacheTime,
    });
    const res = await fetch(req.url, req.options);

    return this.interceptorsResponse<T>(res);
  }

  async request<T>(
    method: Method,
    url: string,
    params?: Params
  ): Promise<BaseResponse<T>> {
    return this.httpFactory<T>({ url, params, method });
  }

  get<T>(url: string, params?: Params): Promise<BaseResponse<T>> {
    return this.request("GET", url, params);
  }

  post<T>(url: string, params?: Params): Promise<BaseResponse<T>> {
    return this.request("POST", url, params);
  }

  put<T>(url: string, params?: Params): Promise<BaseResponse<T>> {
    return this.request("PUT", url, params);
  }

  delete<T>(url: string, params?: Params): Promise<BaseResponse<T>> {
    return this.request("DELETE", url, params);
  }

  patch<T>(url: string, params?: Params): Promise<BaseResponse<T>> {
    return this.request("PATCH", url, params);
  }
}

const request = new Request();

export default request;

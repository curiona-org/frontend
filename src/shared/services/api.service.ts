import { auth } from "@/shared/auth";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export type APIResponse<T = Record<string, unknown>> = {
  success: boolean;
  message: string;
  data?: T;
  error?: ValidationError[] | string;
};

export type ValidationError = {
  field: string;
  message: string;
};

export abstract class APIService {
  protected baseURL: string;
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
    });
    this.attachInterceptors();
  }

  async get<T = unknown>(
    url: string,
    params = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.get<APIResponse<T>>(url, { params, ...config });
  }

  async post<T = unknown>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.post<APIResponse<T>>(url, data, config);
  }

  async put<T = unknown>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.put<APIResponse<T>>(url, data, config);
  }

  async delete<T = unknown>(url: string, config: AxiosRequestConfig = {}) {
    return this.instance.delete<APIResponse<T>>(url, config);
  }

  async patch<T = unknown>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.patch<APIResponse<T>>(url, data, config);
  }

  async request<T = unknown>(config: AxiosRequestConfig) {
    return this.instance.request<APIResponse<T>>(config);
  }

  private attachInterceptors() {
    this.instance.interceptors.request.use(async (request) => {
      if (!this.isAuthorizationAttached()) {
        const session = await auth();
        if (session && session.data && session.data.tokens.access_token) {
          const authorization = `Bearer ${session.data.tokens.access_token}`;
          request.headers["Authorization"] = authorization;

          this.instance.defaults.headers.common["Authorization"] =
            authorization;
        }
      }
      return request;
    });
  }

  private isAuthorizationAttached() {
    const authHeader = this.instance.defaults.headers.common["Authorization"];
    if (authHeader === null || authHeader === undefined || authHeader === "")
      return false;
    else return true;
  }
}

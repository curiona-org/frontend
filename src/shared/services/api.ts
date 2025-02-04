import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

export type APIResponse<T = Record<string, any>> = {
  success: boolean;
  message: string;
  data: T;
};

export abstract class API {
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

  async get<T = any>(
    url: string,
    params = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.get<APIResponse<T>>(url, { params, ...config });
  }

  async post<T = any>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    return this.instance.post<APIResponse<T>>(url, data, config);
  }

  async put<T = any>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    return this.instance.put<APIResponse<T>>(url, data, config);
  }

  async delete<T = any>(url: string, config: AxiosRequestConfig = {}) {
    return this.instance.delete<APIResponse<T>>(url, config);
  }

  async patch<T = any>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.patch<APIResponse<T>>(url, data, config);
  }

  async request<T = any>(config: AxiosRequestConfig) {
    return this.instance.request<APIResponse<T>>(config);
  }

  private attachInterceptors() {
    this.instance.interceptors.request.use(async (request) => {
      if (!this.isAuthorizationAttached()) {
        const session = await getSession();
        if (session && session.token) {
          const authorization = `Bearer ${session.token}`;
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

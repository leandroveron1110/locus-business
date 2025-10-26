// src/api/client.ts
import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/api";
import api from "@/lib/api";

export type ApiResult<T> = T | null;


// 🔹 Método GET genérico
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await api.get<ApiResponse<T>>(url, config);
  return res.data;
}


export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T> > {
  const res = await api.post<ApiResponse<T>>(url, body, config);

  return res.data;
}

// 🔹 Método PUT genérico
export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await api.put<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  const res = await api.patch<ApiResponse<T>>(url, body);
  return res.data;
}

// 🔹 Método DELETE genérico
export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await api.delete<ApiResponse<T>>(url, config);
  return res.data;
}

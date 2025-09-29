// src/api/client.ts
import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/api";
import api from "@/lib/api";

export type ApiResult<T> = T | null;


// 🔹 Método GET genérico
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T | null> {
  const res = await api.get<ApiResponse<T>>(url, config);
  return res.data.data;
}

// 🔹 Método POST genérico
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T | null> {
  const res = await api.post<ApiResponse<T>>(url, body, config);
  return res.data.data;
}

// 🔹 Método PUT genérico
export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T | null> {
  const res = await api.put<ApiResponse<T>>(url, body, config);
  return res.data.data;
}

export async function apiPatch<T>(url: string, body?: any): Promise<ApiResult<T>> {
  const res = await api.patch<ApiResponse<T>>(url, body);
  return res.data.data ?? null;
}

// 🔹 Método DELETE genérico
export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T | null> {
  const res = await api.delete<ApiResponse<T>>(url, config);
  return res.data.data;
}

// src/features/auth/api/authApi.ts
import { handleApiError } from '@/lib/handleApiError';
import { LoginPayload, LoginResponse, User } from '../types/auth';
import { apiGet, apiPost, ApiResult } from '@/lib/apiFetch';

/**
 * Function to perform user login.
 * @param payload User's email and password data.
 * @returns A promise that resolves with the login response (user and token).
 * @throws ApiErrorResponse in case of error.
 */
export const login = async (payload: LoginPayload): Promise<ApiResult<LoginResponse>> => {
  try {
    const response = await apiPost<LoginResponse>('/auth/login/business', payload);
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Unknown error during registration');
  }
};

/**
 * Function to get authenticated user data (e.g., when the app loads).
 * @returns A promise that resolves with the User object.
 * @throws ApiErrorResponse in case of error.
 */
export const getMe = async (): Promise<ApiResult<User>> => {
  try {
    const response = await apiGet<User>('/auth/me');
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Unknown error getting user data');
  }
};

// You can add more functions here for:
// - Password recovery
// - User profile update
// - Email verification, etc.

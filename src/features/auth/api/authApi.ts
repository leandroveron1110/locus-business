// src/features/auth/api/authApi.ts
import api from '../../../lib/api'; // Import the configured Axios instance
import { LoginPayload, LoginResponse, User } from '../types/auth';
import { ApiErrorResponse } from '../../../types/api';

/**
 * Function to perform user login.
 * @param payload User's email and password data.
 * @returns A promise that resolves with the login response (user and token).
 * @throws ApiErrorResponse in case of error.
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login/business', payload);
    return response.data;
  } catch (error: any) {
    // Here you can handle specific errors if necessary,
    // or simply re-throw the error that has already been processed by the global interceptor.
    throw error.response?.data as ApiErrorResponse || new Error('Unknown error during login');
  }
};

/**
 * Function to get authenticated user data (e.g., when the app loads).
 * @returns A promise that resolves with the User object.
 * @throws ApiErrorResponse in case of error.
 */
export const getMe = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/auth/me');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ApiErrorResponse || new Error('Unknown error getting user data');
  }
};

// You can add more functions here for:
// - Password recovery
// - User profile update
// - Email verification, etc.

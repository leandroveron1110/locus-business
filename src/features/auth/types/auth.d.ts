import { PermissionsEnum } from "@/features/common/utils/permissions.enum";

// src/features/auth/types/auth.d.ts
export enum UserRole {
  CLIENT = 'CLIENT',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}



export interface BusinessEmployeeInfo {
  id: string; // El ID del negocio
  role: string; // El nombre del rol del empleado (ej. "Gerente" o "UNASSIGNED")
  permissions?: PermissionsEnum[]; // Los permisos efectivos para ese rol
}

export interface BusinessLogin {
  id: string;
  role: string;
  name: string;
}

// Interface for the User model as we would receive it from the API.
// Sensitive fields like passwordHash are omitted.
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  businesses?: BusinessEmployeeInfo[]; // Usa la nueva interfaz corregida
  deliveries?: any[]; // Puedes definir una interfaz similar para 'deliveries'
}

// Interface for the data needed for login
export interface LoginPayload {
  email: string;
  password: string;
}

// Interface for a successful login response
export interface LoginResponse {
  user: User;
  accessToken: string; // The authentication token (e.g., JWT)
}

// Interface for the data needed to register a new user
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole; // Optional, the backend might assign a default role
}

// Interface for a successful registration response (similar to login, or just the user)
export interface RegisterResponse {
  user: User;
  accessToken: string; // The authentication token
}

// Types for the authentication state in the frontend
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To indicate if the initial session is being verified
  error: string | null;
}

// NUEVA INTERFAZ: Define los tipos para las acciones (funciones) del store
export interface AuthStoreActions {
  login: (payload: LoginResponse) => Promise<User>;
  register: (payload: RegisterResponse) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// NUEVA INTERFAZ: Combina el estado y las acciones para el tipo completo del store
export interface AuthStore extends AuthState, AuthStoreActions {}

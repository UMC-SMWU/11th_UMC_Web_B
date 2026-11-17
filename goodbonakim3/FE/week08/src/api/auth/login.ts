import { apiClient } from "../api-client";
import type { ApiResponse } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<{
  accessToken: string;
}>;

export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
}

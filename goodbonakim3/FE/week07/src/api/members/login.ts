import { apiClient } from "../api-client";

interface ApiResponse<T> {
  isSuccess: boolean;
  result: T;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface MemberInfo {
  email: string;
  nickname: string;
}

export async function login(credentials: LoginRequest) {
  const loginResponse = await apiClient
    .post("auth/login", { json: credentials })
    .json<ApiResponse<{ accessToken: string }>>();

  const token = loginResponse.result?.accessToken;
  if (!loginResponse.isSuccess || !token) {
    throw new Error("로그인 응답에 인증 토큰이 없어요.");
  }

  const memberResponse = await apiClient
    .get("members/me", { headers: { Authorization: `Bearer ${token}` } })
    .json<ApiResponse<MemberInfo>>();

  if (!memberResponse.isSuccess || !memberResponse.result) {
    throw new Error("회원 정보를 불러오지 못했어요.");
  }

  return memberResponse.result;
}

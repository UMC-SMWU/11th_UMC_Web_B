import ky from "ky";

// 백엔드 주소
const umcApiBaseUrl =
  import.meta.env.VITE_UMC_API_BASE_URL ?? "http://localhost:8080";

export const umcClient = ky.create({
  baseUrl: `${umcApiBaseUrl}/`,
  retry: 0,
});

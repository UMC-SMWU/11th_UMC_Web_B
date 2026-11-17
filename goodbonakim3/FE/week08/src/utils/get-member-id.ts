// The backend issues a JWT with the member ID in its subject.
export function getMemberId(accessToken: string | null) {
  const payload = accessToken?.split(".")[1];
  if (!payload) return null;

  try {
    const { sub } = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const memberId = typeof sub === "string" ? Number(sub) : NaN;
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}

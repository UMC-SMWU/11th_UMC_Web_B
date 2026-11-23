export function getMemberIdFromToken(token: string | null): number | null {
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        const memberId = Number(JSON.parse(json).sub);
        return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
    } catch {
        return null;
    }
}

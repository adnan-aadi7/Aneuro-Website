// Base64URL decode
const b64 = (s) => decodeURIComponent(atob(s.replace(/-/g, "+").replace(/_/g, "/"))
  .split("").map(c => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`).join(""));

export const parseJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(b64(payload));
  } catch {
    return null;
  }
};

export const isJwtExpired = (token) => {
  const p = parseJwt(token);
  if (!p?.exp) return false; // if no exp, let server decide
  const now = Math.floor(Date.now() / 1000);
  return p.exp <= now;
};

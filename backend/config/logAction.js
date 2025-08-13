// services/logService.js
import Log from "../model/Log.js";

export function getClientIp(req) {
  let ip =
    req?.headers?.["x-forwarded-for"]?.split(",")[0] ||
    req?.connection?.remoteAddress ||
    req?.socket?.remoteAddress ||
    req?.ip ||
    "unknown";

  // Normalize IPv6 localhost to IPv4
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }

  // If IPv6 mapped IPv4 (::ffff:x.x.x.x), strip the prefix
  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  return ip;
}

export async function logAction({
  action,
  user,
  affectedAsset,
  contentType,
  description,
  ipAddress,
  req // pass req here if available
}) {
  try {
    const finalIp =
      ipAddress || (req ? getClientIp(req) : "0.0.0.0");

    const logEntry = new Log({
      action,
      user: {
        id: user?.id || "system",
        email: user?.email || "system@localhost",
        ipAddress: finalIp
      },
      affectedAsset,
      contentType,
      description
    });

    await logEntry.save();
    console.log("Log saved:", logEntry);
  } catch (err) {
    console.error("Failed to save log:", err.message);
  }
}

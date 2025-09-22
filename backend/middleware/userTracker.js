// middlewares/authUser.js
import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET matches your token generation

    // Attach user info to request
    req.user = {
      id: decoded.id || decoded._id || null,
      name: decoded.name || decoded.username || "",  
      email: decoded.email || null,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

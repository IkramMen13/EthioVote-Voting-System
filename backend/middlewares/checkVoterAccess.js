import jwt from "jsonwebtoken";
import Voter from "../models/voter.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
        redirect: "/login"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET.trim()
    );

    const user = await Voter.findById(decoded.id);

    if (!user || user.status !== "loggedin") {
      return res.status(401).json({
        message: "Session expired",
        redirect: "/login"
      });
    }

    
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      redirect: "/login"
    });
  }
};

export default authMiddleware;

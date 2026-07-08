import jwt from "jsonwebtoken";
import Voter from "../models/voter.js";

export const logoutMiddleware = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: "No authorization header" 
      });
    }

    console.log("Received auth header:", authHeader);
    
    
    let token = authHeader;
    
  
    if (authHeader.startsWith("Bearer ")) {
      console.log("Note: Removing 'Bearer ' prefix");
      token = authHeader.substring(7);
    }
    
    console.log("Using token:", token);
    console.log("Token length:", token.length);
    
    if (token === "null" || token === "undefined" || token.trim() === "") {
      return res.status(401).json({ 
        success: false,
        message: "Token is empty. Please login first." 
      });
    }
    
  
    token = token.replace(/^["']+|["']+$/g, '').trim();
    
    console.log("Cleaned token length:", token.length);
    
    const parts = token.split('.');
    console.log("JWT parts count:", parts.length);
    
    if (parts.length !== 3) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid JWT format",
        tokenPreview: token.substring(0, 50) + '...'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET.trim());
    console.log("Token verified for user:", decoded.id);
    
    
    const user = await Voter.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    
    req.user = user;
    req.token = token;
    next();
    
  } catch (err) {
    console.error("Logout Middleware Error:", err.name, "-", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expired. Please login again" 
      });
    }
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token. Check if token is correct" 
      });
    }
    
  
    if (err.name === "ReferenceError" && err.message.includes("jwt")) {
      console.error(" JWT is not imported in logoutMiddleware.js!");
      return res.status(500).json({ 
        success: false,
        message: "Server configuration error" 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: "Authentication failed" 
    });
  }
};
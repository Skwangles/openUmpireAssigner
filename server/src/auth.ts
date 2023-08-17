import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

// Function to check if the provided password matches the hashed password
const verifyPassword = async (password: string, hashedPassword: string) => {
  const hash = hashString(password);
  return await bcrypt.compare(password, hashedPassword);
};

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};

// Function to hash a string using bcrypt
const hashString = async (inputString: string, saltRounds = 10) => {
  try {
    const hashedString = await bcrypt.hash(inputString, saltRounds);
    return hashedString;
  } catch (error) {
    throw error;
  }
};

export { hashString, verifyPassword, isAuthenticated };

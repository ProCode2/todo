import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { RequestWithUserID } from "../types/common";

const SECRET_KEY = process.env.SECRET_JWT_SIGNING_KEY;

export const auth = (req: RequestWithUserID, res: Response, next: NextFunction) => {
  if (!SECRET_KEY) {
    throw Error("JWT signing key is not present");
  }
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = verify(token, SECRET_KEY) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

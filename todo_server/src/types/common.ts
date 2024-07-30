import { Request } from "express";

export interface RequestWithUserID extends Request {
  userId?: string;
}

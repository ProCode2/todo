import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { RequestWithUserID } from "../types/common";

export const validate = (schema: ZodSchema<any>) => (req: RequestWithUserID, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    next(error);
  }
};

import { Router } from "express";
import { getAllTodosHandler, updateTodoHandler, loginHandler, signupHandler, createTodoHandler, deleteTodoHandler } from "./handlers";
import z from "zod";
import { validate } from "./middlewares/validate";
import { auth } from "./middlewares/auth";

export const router = Router();


// Auth routes
const signupSchema = z.object({
  name: z.string().min(5, "Name is required and must be at least 5 characters"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number, must be 10 digits"),
  password: z.string().min(5, "Password must be at least 5 characters long")

});
router.post("/signup", validate(signupSchema), signupHandler);

const loginSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number, must be 10 digits"),
  password: z.string().min(5, "Password must be at least 5 characters long")

});
router.post("/login", validate(loginSchema), loginHandler);



// Authenticated/protected routed
// Todo Routes
router.get("/todos", auth, getAllTodosHandler);

const createTodoSchema = z.object({
  task: z.string().min(5, "Task should be at leaast 5 characters in length.")

});
router.post("/todos", auth, validate(createTodoSchema), createTodoHandler);

const updateTodoSchema = z.object({
  todoId: z.string(),
  task: z.string().min(5, "Task should be at leaast 5 characters in length.").optional(),
  status: z.enum(["PENDING", "COMPLETED"]).optional()

});
router.put("/todos", validate(updateTodoSchema), auth, updateTodoHandler);

const deleteTodoSchema = z.object({
  todoId: z.string(),

});
router.delete("/todos", auth, validate(deleteTodoSchema), deleteTodoHandler);

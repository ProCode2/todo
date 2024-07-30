import { Request, Response } from "express";
import { createJWT, createTodo, createUser, deleteTodo, getTodos, getUserByPhone, hashPWD, matchPWD, updateTodo } from "./utils";
import { RequestWithUserID } from "./types/common";
import { Status } from "@prisma/client";



export const signupHandler = async (req: Request, res: Response) => {
  const { name, phone, password } = req.body;
  console.log({ name, phone, password });
  const hashedPassword = await hashPWD(password);
  try {
    const user = await createUser(name, phone, hashedPassword);
    const token = createJWT(user.id);
    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ message: err.toString() });
  }
};


export const loginHandler = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  console.log({ phone, password });
  try {
    const user = await getUserByPhone(phone);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const matched = await matchPWD(password, user.password);
    if (!matched) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }
    const token = createJWT(user.id);
    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ message: err.toString() });
  }
};


export const getAllTodosHandler = async (req: RequestWithUserID, res: Response) => {
  if (!req.userId) {
    return res.status(403).json({message: "Unauthenticated"});
  }
  try {
    const todos = await getTodos(req.userId)
    res.status(200).json({ todos });
  } catch (err: any) {
    return res.status(500).json({ message: err.toString() });
  }
}

export const createTodoHandler = async (req: RequestWithUserID, res: Response) => {
  if (!req.userId) {
    return res.status(403).json({message: "Unauthenticated"});
  }
  const { task } = req.body;
  try {
    const todo = await createTodo(req.userId, task);
    return res.status(200).json({ todo });
  } catch (err: any) {
    return res.status(500).json({ message: err.toString() });
  }
}


export const updateTodoHandler = async (req: RequestWithUserID, res: Response) => {
  if (!req.userId) {
    return res.status(403).json({message: "Unauthenticated"});
  }
  const { todoId, task, status } = req.body;
  try {
    const todo = await updateTodo(req.userId, todoId, task, status as Status);
    res.status(200).json({ todo });
  } catch (err: any) {
    return res.status(500).json({ message: err.toString() });
  }
}

export const deleteTodoHandler = async (req: RequestWithUserID, res: Response) => {
  if (!req.userId) {
    return res.status(403).json({message: "Unauthenticated"});
  }
  const { todoId } = req.body;
  try {
    const todo = await deleteTodo(req.userId, todoId);
    res.status(200).json({ todo });
  } catch (err: any) {
    return res.status(500).json({ message: err.toString() });
  }
}


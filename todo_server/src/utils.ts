import { sign } from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { prisma } from "./db";
import { User, Todo, Status, Prisma } from "@prisma/client";

const SECRET_KEY = process.env.SECRET_JWT_SIGNING_KEY;


export const createJWT = (userId: string): string => {
  console.log(SECRET_KEY)
  if (!SECRET_KEY) {
    throw Error("JWT signing key is not present");
  }
  const token = sign({ userId }, SECRET_KEY, {
    expiresIn: '1h',
  });

  return token
}


export const hashPWD = async (password: string): Promise<string> => {
  return (await hash(password, 10));
}

export const matchPWD = async (expectation: string, reality: string): Promise<boolean> => {
  return (await compare(expectation, reality));
}

export const createUser = async (name: string, phone: string, password: string): Promise<User> => {
  const data = await prisma.user.create({
    data: {
      name, phone, password
    }
  });
  return data;
}

export const getUserByPhone = async (phone: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      phone
    }
  });

  return user;
}


// get all todos by of an user
export const getTodos = async (userId: string): Promise<Todo[]> => {
  const todos = await prisma.todo.findMany({ where: { userId } });
  console.log(todos);
  return todos;
}


// create a todo for an user
export const createTodo = async (userId: string, task: string): Promise<Todo> => {
  const todo = await prisma.todo.create({
    data: {
      task,
      status: Status.PENDING,
      userId
    }
  });

  return todo;
}


// update a user todo
export const updateTodo = async (userId: string, todoId: string, task: string, status: Status): Promise<Todo> => {
  const todo = await prisma.todo.update({
    where: {
      userId,
      id: todoId,
    },
    data: {
      task,
      status
    }
  });

  return todo;
}

// delet a todo
export const deleteTodo = async (userId: string, todoId: string): Promise<Todo> => {
  const todo = await prisma.todo.delete({ where: { id: todoId, userId } });

  return todo;
}

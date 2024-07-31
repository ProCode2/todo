"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = exports.getUserByPhone = exports.createUser = exports.matchPWD = exports.hashPWD = exports.createJWT = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const db_1 = require("./db");
const client_1 = require("@prisma/client");
const SECRET_KEY = process.env.SECRET_JWT_SIGNING_KEY;
const createJWT = (userId) => {
    console.log(SECRET_KEY);
    if (!SECRET_KEY) {
        throw Error("JWT signing key is not present");
    }
    const token = (0, jsonwebtoken_1.sign)({ userId }, SECRET_KEY, {
        expiresIn: '1h',
    });
    return token;
};
exports.createJWT = createJWT;
const hashPWD = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, bcrypt_1.hash)(password, 10));
});
exports.hashPWD = hashPWD;
const matchPWD = (expectation, reality) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, bcrypt_1.compare)(expectation, reality));
});
exports.matchPWD = matchPWD;
const createUser = (name, phone, password) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.prisma.user.create({
        data: {
            name, phone, password
        }
    });
    return data;
});
exports.createUser = createUser;
const getUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.findUnique({
        where: {
            phone
        }
    });
    return user;
});
exports.getUserByPhone = getUserByPhone;
// get all todos by of an user
const getTodos = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield db_1.prisma.todo.findMany({ where: { userId } });
    console.log(todos);
    return todos;
});
exports.getTodos = getTodos;
// create a todo for an user
const createTodo = (userId, task) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield db_1.prisma.todo.create({
        data: {
            task,
            status: client_1.Status.PENDING,
            userId
        }
    });
    return todo;
});
exports.createTodo = createTodo;
// update a user todo
const updateTodo = (userId, todoId, task, status) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield db_1.prisma.todo.update({
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
});
exports.updateTodo = updateTodo;
// delet a todo
const deleteTodo = (userId, todoId) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield db_1.prisma.todo.delete({ where: { id: todoId, userId } });
    return todo;
});
exports.deleteTodo = deleteTodo;

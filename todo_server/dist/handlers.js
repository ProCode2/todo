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
exports.deleteTodoHandler = exports.updateTodoHandler = exports.createTodoHandler = exports.getAllTodosHandler = exports.loginHandler = exports.signupHandler = void 0;
const utils_1 = require("./utils");
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, password } = req.body;
    console.log({ name, phone, password });
    const hashedPassword = yield (0, utils_1.hashPWD)(password);
    try {
        const user = yield (0, utils_1.createUser)(name, phone, hashedPassword);
        const token = (0, utils_1.createJWT)(user.id);
        return res.status(200).json({ token });
    }
    catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});
exports.signupHandler = signupHandler;
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password } = req.body;
    console.log({ phone, password });
    try {
        const user = yield (0, utils_1.getUserByPhone)(phone);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const matched = yield (0, utils_1.matchPWD)(password, user.password);
        if (!matched) {
            return res.status(403).json({ message: "Invalid Credentials" });
        }
        const token = (0, utils_1.createJWT)(user.id);
        return res.status(200).json({ token });
    }
    catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});
exports.loginHandler = loginHandler;
const getAllTodosHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthenticated" });
    }
    try {
        const todos = yield (0, utils_1.getTodos)(req.userId);
        res.status(200).json({ todos });
    }
    catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});
exports.getAllTodosHandler = getAllTodosHandler;
const createTodoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthenticated" });
    }
    const { task } = req.body;
    try {
        const todo = yield (0, utils_1.createTodo)(req.userId, task);
        return res.status(200).json({ todo });
    }
    catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});
exports.createTodoHandler = createTodoHandler;
const updateTodoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthenticated" });
    }
    const { todoId, task, status } = req.body;
    try {
        const todo = yield (0, utils_1.updateTodo)(req.userId, todoId, task, status);
        res.status(200).json({ todo });
    }
    catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});
exports.updateTodoHandler = updateTodoHandler;
const deleteTodoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthenticated" });
    }
    const { todoId } = req.body;
    try {
        const todo = yield (0, utils_1.deleteTodo)(req.userId, todoId);
        res.status(200).json({ todo });
    }
    catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});
exports.deleteTodoHandler = deleteTodoHandler;

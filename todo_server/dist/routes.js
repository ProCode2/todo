"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const handlers_1 = require("./handlers");
const zod_1 = __importDefault(require("zod"));
const validate_1 = require("./middlewares/validate");
const auth_1 = require("./middlewares/auth");
exports.router = (0, express_1.Router)();
// Auth routes
const signupSchema = zod_1.default.object({
    name: zod_1.default.string().min(5, "Name is required and must be at least 5 characters"),
    phone: zod_1.default.string().regex(/^\d{10}$/, "Invalid phone number, must be 10 digits"),
    password: zod_1.default.string().min(5, "Password must be at least 5 characters long")
});
exports.router.post("/signup", (0, validate_1.validate)(signupSchema), handlers_1.signupHandler);
const loginSchema = zod_1.default.object({
    phone: zod_1.default.string().regex(/^\d{10}$/, "Invalid phone number, must be 10 digits"),
    password: zod_1.default.string().min(5, "Password must be at least 5 characters long")
});
exports.router.post("/login", (0, validate_1.validate)(loginSchema), handlers_1.loginHandler);
// Authenticated/protected routed
// Todo Routes
exports.router.get("/todos", auth_1.auth, handlers_1.getAllTodosHandler);
const createTodoSchema = zod_1.default.object({
    task: zod_1.default.string().min(5, "Task should be at leaast 5 characters in length.")
});
exports.router.post("/todos", auth_1.auth, (0, validate_1.validate)(createTodoSchema), handlers_1.createTodoHandler);
const updateTodoSchema = zod_1.default.object({
    todoId: zod_1.default.string(),
    task: zod_1.default.string().min(5, "Task should be at leaast 5 characters in length.").optional(),
    status: zod_1.default.enum(["PENDING", "COMPLETED"]).optional()
});
exports.router.put("/todos", (0, validate_1.validate)(updateTodoSchema), auth_1.auth, handlers_1.updateTodoHandler);
const deleteTodoSchema = zod_1.default.object({
    todoId: zod_1.default.string(),
});
exports.router.delete("/todos", auth_1.auth, (0, validate_1.validate)(deleteTodoSchema), handlers_1.deleteTodoHandler);

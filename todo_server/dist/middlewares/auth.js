"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_JWT_SIGNING_KEY;
const auth = (req, res, next) => {
    if (!SECRET_KEY) {
        throw Error("JWT signing key is not present");
    }
    const token = req.header('Authorization');
    if (!token)
        return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.auth = auth;

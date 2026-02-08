"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const courseRoutes_1 = __importDefault(require("./courseRoutes"));
const classRoutes_1 = __importDefault(require("./classRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/', courseRoutes_1.default); // /courses, /subjects
router.use('/', classRoutes_1.default); // /classes, /enrollments, etc.
exports.default = router;
//# sourceMappingURL=index.js.map
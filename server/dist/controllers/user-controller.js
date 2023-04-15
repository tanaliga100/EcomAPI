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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_USER_PASSWORD = exports.UPDATE_USER = exports.SINGLE_USER = exports.CURRENT_USER = exports.ALL_USERS = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const async_middleware_1 = require("../middlewares/async-middleware");
const user_model_1 = __importDefault(require("../models/user-model"));
const attachCookies_1 = require("../utils/attachCookies");
const checkPermission_1 = require("../utils/checkPermission");
const comparePassword_1 = require("../utils/comparePassword");
const hashedPassword_1 = require("../utils/hashedPassword");
const tokenUser_1 = require("../utils/tokenUser");
const ALL_USERS = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("PAYLOAD FROM VERIFIED COOKIE", req.user);
    const users = yield user_model_1.default.find({ role: ["admin", "user", "manager"] });
    if (!users) {
        throw new errors_1.BadRequestError("No Users found");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "ALL_USERS", users });
}));
exports.ALL_USERS = ALL_USERS;
const SINGLE_USER = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("PAYLOAD FROM VERIFIED COOKIE", req.user);
    const user = yield user_model_1.default.findOne({ _id: req.params.id });
    if (!user) {
        throw new errors_1.NotFoundError(`No user with id ${req.params.id}`);
    }
    (0, checkPermission_1.checkPermissions)(req.user, user._id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "SINGLE_USER", user });
}));
exports.SINGLE_USER = SINGLE_USER;
const CURRENT_USER = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = { name: req.user.name, role: req.user.role };
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "CURRENT_USER", currentUser });
}));
exports.CURRENT_USER = CURRENT_USER;
const UPDATE_USER = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new errors_1.BadRequestError("PLEASE PROVIDE ALL THE VALUES");
    }
    const user = yield user_model_1.default.findOneAndUpdate({ _id: req.user.userId }, { email, name }, { new: true, runValidators: true });
    const tokenUser = yield (0, tokenUser_1.createTokenUser)(user);
    // ATTACH COOKIES
    (0, attachCookies_1.attachCookiesToResponse)(res, tokenUser);
    // OK ? SEND BACK TO CLIENT : THROW ERROR
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "USER_UPDATED", data: tokenUser });
}));
exports.UPDATE_USER = UPDATE_USER;
const UPDATE_USER_PASSWORD = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.BadRequestError("Please provide both values");
    }
    const user = yield user_model_1.default.findOne({ _id: req.user.userId });
    if (!user) {
    }
    const isPasswordCorrect = yield (0, comparePassword_1.comparePassword)(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordCorrect) {
        throw new errors_1.UnAuthenticatedError("Invalid password");
    }
    const hashedPassword = yield (0, hashedPassword_1.hashPassword)(newPassword);
    user.password = hashedPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "USER_PASSWORD_UPDATED" });
}));
exports.UPDATE_USER_PASSWORD = UPDATE_USER_PASSWORD;

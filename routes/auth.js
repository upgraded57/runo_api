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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_js_1 = __importDefault(require("../models/User.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const router = express_1.default.Router();
//REGISTER
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({
            message: "All fields requred",
            fields: ["username", "email", "password"],
        });
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPass = yield bcrypt_1.default.hash(password, salt);
        const newUser = new User_js_1.default({
            username,
            email,
            password: hashedPass,
        });
        const savedUser = yield newUser.save();
        const token = jsonwebtoken_1.default.sign({
            user_id: savedUser._id,
        }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
        // Convert Mongoose document to plain JavaScript object
        const userObject = savedUser.toObject();
        const { password: newuserPassword } = userObject, user = __rest(userObject, ["password"]);
        res.status(200).json({ token, user });
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//LOGIN
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({
            message: "All fields required",
            fields: ["username", "password"],
        });
    try {
        const user = yield User_js_1.default.findOne({ username });
        if (!user)
            return res.status(400).json("Wrong credentials!");
        const validated = yield bcrypt_1.default.compare(password, user.password);
        !validated && res.status(400).json("Wrong credentials!");
        const token = jsonwebtoken_1.default.sign({
            user_id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
        const userObject = user.toObject();
        const { password: newuserPassword } = userObject, authUser = __rest(userObject, ["password"]);
        res.status(200).json({ user: authUser, token });
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.default = router;

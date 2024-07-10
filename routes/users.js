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
const Post_js_1 = __importDefault(require("../models/Post.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
//UPDATE
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            req.body.password = yield bcrypt_1.default.hash(req.body.password, salt);
        }
        try {
            const updatedUser = yield User_js_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedUser);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(401).json("You can update only your account!");
    }
}));
//DELETE
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.userId === req.params.id) {
        try {
            const user = yield User_js_1.default.findById(req.params.id);
            if (!user)
                return res.status(400).json({ message: "Cannot find post" });
            try {
                yield Post_js_1.default.deleteMany({ username: user.username });
                yield User_js_1.default.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
            }
            catch (err) {
                res.status(500).json(err);
            }
        }
        catch (err) {
            res.status(404).json("User not found!");
        }
    }
    else {
        res.status(401).json("You can delete only your account!");
    }
}));
//GET USER
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_js_1.default.findById(req.params.id);
        if (!user)
            return res.status(400).json({ message: "Cannot find post" });
        // Convert Mongoose document to plain JavaScript object
        const userObject = user.toObject();
        const { password: newuserPassword } = userObject, others = __rest(userObject, ["password"]);
        res.status(200).json({ user: others });
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.default = router;

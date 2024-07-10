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
const express_1 = __importDefault(require("express"));
const Post_js_1 = __importDefault(require("../models/Post.js"));
const file_upload_js_1 = require("../utils/file-upload.js");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = express_1.default.Router();
//CREATE POST
router.post("/", upload.single("photo"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categories, username, desc, title } = req.body;
    if (!categories || !username || !desc || !title)
        return res.status(400).json({
            message: "All fields required",
            fields: ["categories", "username", "photo", "desc", "title"],
        });
    const uploadUrl = yield (0, file_upload_js_1.handleFileUpload)(req.file.path);
    // Send photo to cloudinary
    const newPost = new Post_js_1.default({
        categories,
        username,
        desc,
        title,
        photo: uploadUrl === null || uploadUrl === void 0 ? void 0 : uploadUrl.url,
    });
    try {
        const savedPost = yield newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//UPDATE POST
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_js_1.default.findById(req.params.id);
        if (!post)
            return res.status(400).json("Cannot find post");
        if (post.username === req.body.username) {
            try {
                const updatedPost = yield Post_js_1.default.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                }, { new: true });
                res.status(200).json(updatedPost);
            }
            catch (err) {
                res.status(500).json(err);
            }
        }
        else {
            res.status(401).json("You can update only your post!");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//DELETE POST
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_js_1.default.findById(req.params.id);
        if (!post)
            return res.status(400).json("Cannot find post");
        if (post.username === req.body.username) {
            try {
                yield post.deleteOne();
                res.status(200).json("Post has been deleted...");
            }
            catch (err) {
                res.status(500).json(err);
            }
        }
        else {
            res.status(401).json("You can delete only your post!");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET POST
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_js_1.default.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET ALL POSTS
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.user;
    // const catName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = yield Post_js_1.default.find({ username });
        }
        else {
            posts = yield Post_js_1.default.find();
        }
        return res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.default = router;

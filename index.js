"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const users_js_1 = __importDefault(require("./routes/users.js"));
const posts_js_1 = __importDefault(require("./routes/posts.js"));
const path_1 = __importDefault(require("path"));
// Initialize app
const app = (0, express_1.default)();
// environment variables configuration
dotenv_1.default.config();
// Express body parser
app.use(express_1.default.json());
// cors
app.use((0, cors_1.default)());
// Image upload directory
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "/images")));
// Mongo DB connection
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => {
    // Listen for API connection access if db connection is successful
    app.listen("8000", () => {
        console.log("Backend service running on port 8000.");
    });
    console.log("Connected to MongoDB");
})
    .catch((err) => console.log(err));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});
app.use("/auth", auth_js_1.default);
app.use("/users", users_js_1.default);
app.use("/posts", posts_js_1.default);

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
exports.handleFileUpload = void 0;
const cloudinary_1 = require("cloudinary");
require("dotenv/config");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const handleFileUpload = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield cloudinary_1.v2.uploader.upload(imageUrl, {
            folder: "runo",
        });
        return uploadResult;
    }
    catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
});
exports.handleFileUpload = handleFileUpload;

import { Request } from "express";
import { File } from "multer"; // Adjust this import according to the type of the `file` object in your multer setup

declare module "express-serve-static-core" {
  interface Request {
    file?: File;
  }
}

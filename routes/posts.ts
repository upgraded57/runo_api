import express, { Request, Response } from "express";
import Post from "../models/Post";
import { handleFileUpload } from "../utils/file-upload";

import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

//CREATE POST
router.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    const { categories, username, desc, title } = req.body;

    if (!categories || !username || !desc || !title)
      return res.status(400).json({
        message: "All fields required",
        fields: ["categories", "username", "photo", "desc", "title"],
      });

    const uploadUrl = await handleFileUpload(req.file!.path);
    // Send photo to cloudinary
    const newPost = new Post({
      categories,
      username,
      desc,
      title,
      photo: uploadUrl?.url,
    });
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//UPDATE POST
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json("Cannot find post");
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json("Cannot find post");
    if (post.username === req.body.username) {
      try {
        await post.deleteOne();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req: Request, res: Response) => {
  const username = req.query.user;
  // const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else {
      posts = await Post.find();
    }

    return res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

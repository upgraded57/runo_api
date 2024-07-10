import express, { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

const router = express.Router();

//REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({
      message: "All fields requred",
      fields: ["username", "email", "password"],
    });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        user_id: savedUser._id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: 60 * 60 * 24 }
    );

    // Convert Mongoose document to plain JavaScript object
    const userObject = savedUser.toObject();
    const { password: newuserPassword, ...user } = userObject;

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({
      message: "All fields required",
      fields: ["username", "password"],
    });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(password, user.password);
    !validated && res.status(400).json("Wrong credentials!");
    const token = jwt.sign(
      {
        user_id: user._id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: 60 * 60 * 24 }
    );

    const userObject = user.toObject();
    const { password: newuserPassword, ...authUser } = userObject;

    res.status(200).json({ user: authUser, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

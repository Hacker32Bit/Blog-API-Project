import express, { Request, Response } from "express";
import User from "../models/user";
import { registerSchema } from "../validation/user.schema";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, nickName, age, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { nickName }],
  });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User by that email or nickname already exists" });
  }

  const newUser = new User({ name, age, email, password, nickName });
  const savedUser = await newUser.save();

  const token = jwt.sign(
    { userId: savedUser._id },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "1h" }
  );

  res.status(201).json( { token });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const dbUser = await User.findOne({ email });

  if (!dbUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // @ts-ignore
  const isMatch = await dbUser.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: dbUser._id },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

export { router as usersRouter };

import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken";
import User from "../models/user";

interface IRequest extends Request {
    userId?: string;
}

const authentucate = async (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Authorization token required!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    //@ts-ignore
    const userId = decoded.userId;
    const dbUser = await User.findById(userId);

    if (!dbUser) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = dbUser._id;
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

export { authentucate }
import express, { Request, Response } from "express";
import Article from "../models/article";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../validation/article.schema";
import { authentucate } from "../middleware/authenticate";
import multer from "multer";
import { uploadFile } from "../lib/aws-s3";

const router = express.Router();

interface IRequest extends Request {
  userId?: string;
}

const storage = multer.diskStorage({
  destination: function (req: IRequest, file: any, cb: any) {
    cb(null, __dirname + "/../../public/uploads/");
  },
  filename: function (req: IRequest, file: any, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req: IRequest, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an Image! Please upload only image!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// create Article
router.post("/", authentucate, async (req: IRequest, res: Response) => {
  try {
    const { error } = createArticleSchema.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { title, content, image, author, categories } = req.body;

    const article = new Article({
      title,
      content,
      image,
      author: req.userId,
      categories,
      createdAt: new Date(),
    });

    const newArticle = await article.save();

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).send(error);
  }
});

// upload image
router.post(
  "/image",
  authentucate,
  upload.single("image"),
  async (req: IRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      const result = await uploadFile(req.file);

      res
        .status(201)
        .json({
          imagePath: process.env.PROJECT_URL + "/uploads/" + req.file.filename,
        });
    } catch (error) {
      console.log("In error!");
      res.status(400).send(error);
    }
  }
);

// get all Articles
router.get("/", async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({}, { __v: 0, content: 0, comments: 0 })
      .populate("author", "_id name nickName image")
      .populate("categories", "_id name");
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:articleId", async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.articleId, { __v: 0 })
      .populate("author", "_id name nickName image")
      .populate("categories", "_id name");

    if (!article) return res.status(404).json({ message: "Article not found" });

    res.status(200).json(article);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:articleId", async (req: Request, res: Response) => {
  const { error } = updateArticleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await Article.findByIdAndUpdate(
      req.params.articleId,
      req.body,
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(400).send(error);
  }
});

export { router as articleRouter };

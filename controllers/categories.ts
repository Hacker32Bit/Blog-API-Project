import express, { Request, Response } from "express";
import Category from "../models/category";
import { categorySchema } from "../validation/category.schema";
const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *  post:
 *    summary: Create a new category
 *    description: Create a new category
 *    tags: [Categories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The category's name
 *    responses:
 *      200:
 *        description: The category was successfully created
 *      400:
 *        description: The cetegory already exists
 */
router.post("/", async (req: Request, res: Response) => {
  const { error } = categorySchema.validate(req.body)

  if (error) {
    return res.status(400).json({ message: error.details[0].message})
  }

  const { name } = req.body;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const newCategory = new Category({ name });
  await newCategory.save();

  res.json(newCategory);
});

router.get("/", async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
});

export { router as categoriesRouter };

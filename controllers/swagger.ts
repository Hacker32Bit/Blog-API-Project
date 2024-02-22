import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger";

const router = express.Router();

router.get("/swagger.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { router as swaggerRouter };

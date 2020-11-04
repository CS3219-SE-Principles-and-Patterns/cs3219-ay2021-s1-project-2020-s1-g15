import { Router, Request, Response } from "express";

import { getAnalyticsbyUserId } from "../controllers/analytics";
import { HttpStatusCode } from "../utils";
import { AnalyticsResponse } from "../utils/types/analyticsTypes";

const router: Router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const analyticsRes: AnalyticsResponse = await getAnalyticsbyUserId(id);

  return res.status(HttpStatusCode.OK).json(analyticsRes);
});

export default router;

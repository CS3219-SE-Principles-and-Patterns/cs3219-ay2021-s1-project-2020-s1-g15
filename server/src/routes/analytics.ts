import { Router, Request, Response } from "express";
import { verifyUserAuth } from "../middlewares/authRouteHandler";
import { getAnalyticsbyUserId } from "../controllers/analytics";
import { analyticsResponse, HttpStatusCode } from "../utils";

const router: Router = Router();

router.get("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const analyticsRes: analyticsResponse = await getAnalyticsbyUserId(id);

  return res.status(HttpStatusCode.OK).json(analyticsRes);
});

export default router;

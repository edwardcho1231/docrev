import { Router } from "express";
import { getAuth, requireAuth } from "@clerk/express";

export const documentRouter = Router();

documentRouter.use(requireAuth());

documentRouter.get("/", (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId, documents: [] });
});

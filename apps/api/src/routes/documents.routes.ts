import { Router } from "express";
import { getAuth } from "@clerk/express";
import { z } from "zod";

export const documentRouter = Router();

documentRouter.get("/", (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({error: 'Unauthorized access'})
  res.json({ userId, documents: [] });
});

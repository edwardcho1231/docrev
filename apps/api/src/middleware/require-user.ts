import { getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

export const requireUser: RequestHandler = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
  }

  res.locals.userId = userId;
  next();
};

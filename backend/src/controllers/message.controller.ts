import { RequestHandler } from "express";

export const getUsersForSidebar: RequestHandler = async (req, res) => {
  res.status(200).json([]);
};

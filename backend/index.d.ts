import { UserModel } from "../models/users"; // Adjust the path based on your project structure

declare module "express-serve-static-core" {
  interface Request {
    user?: UserModel; // This ensures req.user exists
  }
}

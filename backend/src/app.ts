import express from "express";
// import NoteModel from "./models/notes";
import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./routes/users";
// import session from "express-session";
// import validateEnv from "./utils/validateEnv";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  next(createHttpError(404, "END POINT NOT FOUND"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "Something went wrong";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  // if (error instanceof Error) errorMessage = error.message;
  res.status(statusCode).json({ error: errorMessage });
});

export default app;

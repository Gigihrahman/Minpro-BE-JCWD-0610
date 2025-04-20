import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRouter from "./routes/auth.router";
import profileRouter from "./routes/profile.router";
import fotoprofileRouter from "./routes/fotoprofile.router";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/fotoprofile", fotoprofileRouter);

app.use(errorMiddleware);

app.listen(8000, () => {
  console.log(`Server running on PORT :${8000}`);
});

import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import sampleRouter from "./routes/sample.router";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/samples", sampleRouter);
app.use(errorMiddleware);
app.listen(8000, () => {
  console.log(`Server running on PORT :${8000}`);
});

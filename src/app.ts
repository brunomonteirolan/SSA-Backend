import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { notFound, errorHandler } from "./middlewares";
import api from "./api";
import { web } from "./constants/configConstants";
import { setupSentry } from "./loaders/sentry";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.redirect(web.url));

app.use("/api", api);

if (process.env.NODE_ENV !== "development") {
  setupSentry(app);
}

app.use(notFound);
app.use(errorHandler);

export default app;

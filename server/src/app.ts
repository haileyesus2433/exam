import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import videoRoutes from "./routes/video/video.routes";
import channelRoutes from "./routes/channel/channel.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/")));

app.use(helmet());
app.use(morgan("combined"));
app.use(cors());

app.use(videoRoutes);
app.use(channelRoutes);
export default app;

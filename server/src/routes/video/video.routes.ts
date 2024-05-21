import { Router } from "express";
import {
  addVideo,
  deleteVideo,
  getVideos,
  updateVideo,
} from "./video.controller";

const router = Router();

router.get("/videos", getVideos);

router.post("/videos", addVideo);

router.patch("/videos", updateVideo);

router.delete("/videos", deleteVideo);

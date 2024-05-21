import { Router } from "express";
import {
  addChannel,
  deleteChannel,
  getChannels,
  updateChannel,
} from "./channel.controller";

const router = Router();

router.get("/channels", getChannels);

router.post("/channels", addChannel);

router.patch("/channels", updateChannel);

router.delete("/channels", deleteChannel);

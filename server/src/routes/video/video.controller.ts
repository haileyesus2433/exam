import { GetQuery } from "./../../types.d";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { VideoSchema } from "../../utils/validations";

const prisma = new PrismaClient();

/**
 * Retrieves a list of all videos.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A JSON response containing the list of videos.
 * @throws {Error} - If an error occurs while retrieving the videos.
 */
async function getVideos(req: Request, res: Response) {
  const { search = "", limit = 10 } = req.body.query as GetQuery;
  const page = Math.max(1, req.body.query.page || 1);
  try {
    const skip = (page - 1) * limit;
    const videos = await prisma.video.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
    });
    const totalCount = await prisma.video.count({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({ videos, totalCount, totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Adds a new video to the database.
 *
 * @param req - The Express request object containing the video data in the request body.
 * @param res - The Express response object to send the created video data or error response.
 * @returns A JSON response with the created video data or an error response.
 */
async function addVideo(req: Request, res: Response) {
  try {
    const result = await VideoSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const newVideo = result.data;
    const insertResult = await prisma.video.create({
      data: newVideo,
    });
    res.status(201).json(insertResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Updates an existing video in the database.
 *
 * @param req - The HTTP request object containing the updated video data.
 * @param res - The HTTP response object to send the update result.
 * @returns A JSON response with the updated video data, or an error response if the update fails.
 */
async function updateVideo(req: Request, res: Response) {
  try {
    const result = await VideoSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const newVideo = result.data;
    const insertResult = await prisma.channel.update({
      where: {
        id: newVideo.id,
      },
      data: newVideo,
    });
    res.status(201).json(insertResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Deletes a video from the database.
 *
 * @param req - The Express request object, containing the `id` of the video to delete.
 * @param res - The Express response object, which will be used to send the result of the delete operation.
 * @returns A JSON response with the result of the delete operation.
 */
async function deleteVideo(req: Request, res: Response) {
  try {
    const { id } = req.body;
    const deleteResult = await prisma.video.delete({
      where: {
        id: id,
      },
    });
    res.status(201).json(deleteResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

export { getVideos, addVideo, updateVideo, deleteVideo };

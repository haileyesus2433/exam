import { GetQuery } from "./../../types.d";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ChannelSchema } from "../../utils/validations";

const prisma = new PrismaClient();

/**
 * Retrieves a list of all channels.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A JSON response containing the list of channels.
 * @throws {Error} - If an error occurs while retrieving the channels.
 */
async function getChannels(req: Request, res: Response) {
  const { search = "", limit = 10 } = req.body.query as GetQuery;
  const page = Math.max(1, req.body.query.page || 1);
  try {
    const skip = (page - 1) * limit;
    const channels = await prisma.channel.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
    });
    const totalCount = await prisma.channel.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({ channels, totalCount, totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Adds a new channel to the database.
 *
 * @param req - The Express request object containing the channel data in the request body.
 * @param res - The Express response object to send the created channel data or error response.
 * @returns A JSON response with the created channel data or an error response.
 */
async function addChannel(req: Request, res: Response) {
  try {
    const result = await ChannelSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const newChannel = result.data;
    const insertResult = await prisma.channel.create({
      data: newChannel,
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
 * Updates an existing channel in the database.
 *
 * @param req - The HTTP request object containing the updated channel data.
 * @param res - The HTTP response object to send the update result.
 * @returns A JSON response with the updated channel data, or an error response if the update fails.
 */
async function updateChannel(req: Request, res: Response) {
  try {
    const result = await ChannelSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const newChannel = result.data;
    const insertResult = await prisma.channel.update({
      where: {
        id: newChannel.id,
      },
      data: newChannel,
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
 * Deletes a channel from the database.
 *
 * @param req - The Express request object, containing the `id` of the channel to delete.
 * @param res - The Express response object, which will be used to send the result of the delete operation.
 * @returns A JSON response with the result of the delete operation.
 */
async function deleteChannel(req: Request, res: Response) {
  try {
    const { id } = req.body;
    const deleteResult = await prisma.channel.delete({
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

export { getChannels, addChannel, updateChannel, deleteChannel };

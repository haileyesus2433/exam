import { z } from "zod";

const VideoSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1),
  duration: z.number().int().positive(),
  description: z.string().min(1),
  channelId: z.number().int().positive(),
  typeId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  videoUrl: z.string().url(),
});

const ChannelSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
});

const TypeSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
});

const CategorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  role: z.string().default("user"),
  avatar: z.string().optional().nullable(),
  email: z.string().email(),
  password: z.string().min(6),
  favourites: z.array(VideoSchema).optional(),
  watchLater: z.array(VideoSchema).optional(),
});
// Type definitions
export type Video = z.infer<typeof VideoSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type Type = z.infer<typeof TypeSchema>;
export type Category = z.infer<typeof CategorySchema>;

export {
  VideoSchema,
  ChannelSchema,
  TypeSchema,
  CategorySchema,
  LoginSchema,
  UserSchema,
};

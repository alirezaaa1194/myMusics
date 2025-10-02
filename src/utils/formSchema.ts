import * as z from "zod";

export const uploadFormSchema = z.discriminatedUnion("musicType", [
  z.object({
    musicType: z.literal("link"),
    musicName: z.string().min(2, "Music name must be at least 2 characters long"),
    singerName: z.string().min(2, "Singer name must be at least 2 characters long"),
    musicLink: z.httpUrl("Please enter a valid URL"),
    musicFile: z.any().optional(),
  }),
  z.object({
    musicType: z.literal("file"),
    musicName: z.string().min(2, "Music name must be at least 2 characters long"),
    singerName: z.string().min(2, "Singer name must be at least 2 characters long"),
    musicFile: z.instanceof(File, { message: "Please upload a file" }),
    musicLink: z.string().optional(),
  }),
]);

export const loginFormSchema = z.object({
  email: z.email("Please enter a correct email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const signupFormSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters long"),
  email: z.email("Please enter a correct email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const folderFormSchema = z.object({
  title: z.string().min(1, "Please enter a folder name"),
});

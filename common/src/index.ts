import zod from "zod";
export const signupInput = zod.object({
  username: zod.string().email(),
  password: zod.string().optional(),
  name: zod.string().optional(),
});
export type signupInput = zod.infer<typeof signupInput>;
export const signinInput = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
});
export type signinInput = zod.infer<typeof signinInput>;
export const createBlogInput = zod.object({
  title: zod.string(),
  content: zod.string(),
});
export type createBlogInput = zod.infer<typeof createBlogInput>;

export const updateBlogInput = zod.object({
  title: zod.string(),
  content: zod.string(),
  id: zod.number(),
});
export type updateBlogInput = zod.infer<typeof updateBlogInput>;

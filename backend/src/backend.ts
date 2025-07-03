import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { decode, jwt, sign, verify } from "hono/jwt";
import { withAccelerate } from "@prisma/extension-accelerate";
import { userRouter } from "./routes/userRouter";
import { blogRouter } from "./routes/blogRouter";
// To avoid the type error for the DATABASE_URL, passed a Generic and mentioned the type
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;

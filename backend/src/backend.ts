import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/extension";
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
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Using a middleware for authentication checks now
// Getting the header, verifying it, if fails, return a status code, otherwise proceed
app.use("/api/v1/blog/*", async (c, next) => {
  const header = c.req.header("Authorization") || "";
  const response = await verify(header, c.env.JWT_SECRET);
  if (response.id) {
    next();
  } else {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }
});

export default app;

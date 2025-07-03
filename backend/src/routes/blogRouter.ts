import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.post("/api/v1/blog", (c) => {});

blogRouter.put("/api/v1/blog", (c) => {});
blogRouter.get("/api/v1/blog/bulk", (c) => {});
blogRouter.get("/api/v1/blog/:id", (c) => {});

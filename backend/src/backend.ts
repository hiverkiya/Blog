import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
// To avoid the type error for the DATABASE_URL, passed a Generic and mentioned the type
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/signup", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate);
});

app.post("/api/v1/signin", (c) => {});

app.post("/api/v1/blog", (c) => {});

app.put("/api/v1/blog", (c) => {});

app.get("/api/v1/blog/:id", (c) => {});
export default app;

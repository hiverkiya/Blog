import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/extension";
import { decode, jwt, sign, verify } from "hono/jwt";
import { withAccelerate } from "@prisma/extension-accelerate";
// To avoid the type error for the DATABASE_URL, passed a Generic and mentioned the type
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

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
app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    //Using jwt provided by Hono

    const jwt = sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Error while signing up" });
  }
});

app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({
      error: "User not found",
    });
  }
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

app.post("/api/v1/blog", (c) => {});

app.put("/api/v1/blog", (c) => {});

app.get("/api/v1/blog/:id", (c) => {});
export default app;

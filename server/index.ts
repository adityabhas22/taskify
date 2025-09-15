import router from "./api";
import { Elysia } from "elysia";
import connectDB from "./data/database";
import { swagger } from "@elysiajs/swagger";

connectDB();

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Taskify API",
          version: "1.0.0",
          description: "A task management API with user authentication",
        },
        tags: [
          { name: "auth", description: "Authentication endpoints" },
          { name: "tasks", description: "Task management endpoints" },
        ],
      },
    })
  )
  .use(router)
  .listen(3005);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

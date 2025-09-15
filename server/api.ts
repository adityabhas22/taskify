import { Elysia, t } from "elysia";
import { UserModel, TaskModel } from "./data/database";
import { createJWT, requireAuth } from "./utils";
const router = new Elysia();

router
  .get("/", () => ({
    message: "Welcome to Taskify API",
    endpoints: {
      swagger: "/swagger",
      auth: {
        register: "POST /auth/register",
        login: "POST /auth/login",
      },
      tasks: {
        getTasks: "GET /tasks",
        createTask: "POST /tasks",
        updateTask: "PATCH /tasks/:id",
        deleteTask: "DELETE /tasks/:id",
      },
    },
  }))
  .post(
    "/auth/register",
    async ({ body, set }) => {
      const { name, email, password } = body;
      try {
        const user = await UserModel.create({
          name,
          email,
          passwordHash: password,
        });
        set.status = 201;
        return { user: user, message: "User registered successfully" };
      } catch (error) {
        set.status = 404;
        console.log(error);
        return { message: "User could not be registered" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/auth/login",
    async ({ body, set }) => {
      const { email, password } = body as { email: string; password: string };
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          set.status = 404;
          return { message: "User not found" };
        }
        if (user.passwordHash !== password) {
          set.status = 401;
          return { message: "Invalid password" };
        }

        // Create JWT token
        const token = await createJWT({
          _id: user._id?.toString() || user.id,
          email: user.email || "",
          name: user.name || "",
        });

        return { token };
      } catch (error) {
        set.status = 500;
        return { message: "Login failed" };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get("/tasks", async ({ headers, set, query }) => {
    try {
      const user = await requireAuth(headers.authorization);

      // Build query object for filtering
      const queryFilter: any = { userId: user.userId };

      // Add category filter if provided
      if (query.category) {
        queryFilter.category = query.category;
      }

      const tasks = await TaskModel.find(queryFilter);
      return tasks;
    } catch (error) {
      set.status = 500;
      return { message: "Internal Server error" };
    }
  })
  .post(
    "/tasks",
    async ({ headers, set, body }) => {
      try {
        const user = await requireAuth(headers.authorization);
        const { title, description, category } = body;
        const task = await TaskModel.create({
          userId: user.userId,
          title,
          description,
          category,
        });
        return { task };
      } catch (error) {
        set.status = 500;
        return { message: "Internal Server error" };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        category: t.String(),
      }),
    }
  )
  .patch("/tasks/:id", async ({ headers, set, params }) => {
    try {
      const user = await requireAuth(headers.authorization);

      // Validate ObjectId format
      if (!params.id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("Invalid ObjectId format:", params.id);
        set.status = 400;
        return { message: "Invalid task ID format" };
      }

      const task = await TaskModel.findOneAndUpdate(
        { _id: params.id, userId: user.userId },
        { isDone: true },
        { new: true }
      );

      if (!task) {
        set.status = 404;
        return { message: "Task not found" };
      }

      return { task };
    } catch (error) {
      // Handle authentication errors specifically
      set.status = 500;
      return { message: "Internal Server error" };
    }
  })
  .delete("/tasks/:id", async ({ headers, set, params }) => {
    try {
      const user = await requireAuth(headers.authorization);

      // Validate ObjectId format
      if (!params.id.match(/^[0-9a-fA-F]{24}$/)) {
        set.status = 400;
        return { message: "Invalid task ID format" };
      }

      const deletedTask = await TaskModel.findOneAndDelete({
        _id: params.id,
        userId: user.userId,
      });

      if (!deletedTask) {
        set.status = 404;
        return { message: "Task not found" };
      }

      return { message: "Task deleted successfully" };
    } catch (error) {
      console.log(error);
      set.status = 500;
      return { message: "Internal Server error" };
    }
  });

export default router;

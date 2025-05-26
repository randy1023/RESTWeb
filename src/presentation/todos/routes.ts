import { Router } from "express";
import { TodosController } from "./index";

export class TodosRoutes {
  constructor() {}

  static get routes(): Router {
    const router = Router();
    const todoController = new TodosController();
    router.get("/", todoController.getTodos);
    router.get("/:id", todoController.getTodoById);
    router.post("/", todoController.createTodo);
    router.put("/:id", todoController.updateTodo);
    router.delete("/:id", todoController.deleteTodoById);

    return router;
  }
}

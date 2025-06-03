import { Router } from "express";
import { TodosController } from "./index";
import { TodoDatasourceImpl, TodoRepositoryImpl } from "../../infrastructure";

export class TodosRoutes {
  constructor() {}

  static get routes(): Router {
    const router = Router();
    const todoDatasource = new TodoDatasourceImpl();
    const todoRepositoryImpl = new TodoRepositoryImpl(todoDatasource);
    const todoController = new TodosController(todoRepositoryImpl);
    router.get("/", todoController.getTodos);
    router.get("/:id", todoController.getTodoById);
    router.post("/", todoController.createTodo);
    router.put("/:id",todoController.updateTodo);
    router.delete("/:id", todoController.deleteTodoById);

    return router;
  }
}

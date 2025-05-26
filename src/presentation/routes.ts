import { Router } from "express";
import { TodosRoutes } from "./todos";

export class AppRoutes {
  constructor() {}

  static get routes(): Router {
    const router = Router();
    router.use("/api/todos", TodosRoutes.routes);

    return router;
  }
}

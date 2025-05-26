import { Request, Response } from "express";
const todos = [
  { id: 1, todo: "Buy milk", completedAt: new Date() },
  { id: 2, todo: "Buy beers", completedAt: null },
  { id: 3, todo: "Buy meat", completedAt: new Date() },
];
export class TodosController {
  //* DI
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    res.json(todos);
    return;
  };
  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: "Id argument is not a number" });
      return;
    }
    const todo = todos.find((todo) => todo.id === id);
    todo
      ? res.json({ todo })
      : res.status(404).json({ error: `ID ${id} not found` });
    return;
  };
  public createTodo = (req: Request, res: Response) => {
    const { todo } = req.body;
    if (!todo) {
      res.status(400).json({ error: "prop todo is riquired" });
      return;
    }
    const newTodo = {
      id: todos.length + 1,
      todo,
      completedAt: null,
    };
    todos.push(newTodo);

    res.json(newTodo);
  };
  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    const { todo, completedAt } = req?.body;
    if (isNaN(id)) {
      res.status(400).json({ error: "Id argument is not a number" });
      return;
    }

    const todoExist = todos.find((prevTodo) => prevTodo.id === id);
    if (!todoExist) {
      res.status(400).json({ error: `todo with ${id} not found` });
      return;
    }
    //! OJO, referencia (no deberiamos mutar el objeto)
    todoExist.todo = todo || todoExist.todo;
    completedAt === null
      ? (todoExist.completedAt = null)
      : (todoExist.completedAt = new Date(
          completedAt || todoExist.completedAt
        ));

    res.json({ todoExist });
  };
  public deleteTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: "Id argument is not a number" });
      return;
    }
    const todoDelete = todos.find((prevTodo) => prevTodo.id === id);
    if (!todoDelete) {
      res.status(400).json({ error: `todo with ${id} not found` });
      return;
    }
    const newTodos = todos.filter((todo) => todo.id !== id);
    todos.length = 0;
    newTodos.forEach((newTodo) => todos.push(newTodo));

    res.json({ todoDelete });
  };
}

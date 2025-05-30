import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
export class TodosController {
  //* DI
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
    return;
  };
  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: "Id argument is not a number" });
      return;
    }
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `ID ${id} not found` });
  };
  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }
    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    res.json(todo);
  };
  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ id, ...req.body });
    if (error) return res.status(400).json({ error });
    const todoExist = await prisma.todo.findUnique({
      where: {
        id: updateTodoDto!.id,
      },
    });
    if (!todoExist) {
      res.status(400).json({ error: `todo with ${id} not found` });
      return;
    }

    const updateTodo = await prisma.todo.update({
      where: {
        id: updateTodoDto!.id,
      },
      data: updateTodoDto!.values,
    });
    res.json(updateTodo);
  };
  public deleteTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: "Id argument is not a number" });
      return;
    }
    const todoExist = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    if (!todoExist) {
      res.status(400).json({ error: `todo with ${id} not found` });
      return;
    }
    const todoDeleted = await prisma.todo.delete({
      where: {
        id,
      },
    });
    res.json(todoDeleted);
  };
}

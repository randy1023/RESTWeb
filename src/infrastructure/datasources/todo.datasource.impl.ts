import { prisma } from "../../data/postgres";
import {
  CreateTodoDto,
  TodoDatasource,
  TodoEntity,
  UpdateTodoDto,
} from "../../domain";

export class TodoDatasourceImpl implements TodoDatasource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({
      data: createTodoDto,
    });
    return TodoEntity.fromJson(todo);
  }
  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany();
    return todos.map((todo) => TodoEntity.fromJson(todo));
  }
  async findById(id: number): Promise<TodoEntity> {
    if (isNaN(id)) {
      throw `id must be a number property`;
    }
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    if (!todo) throw `Todo with id ${id} not found`;
    return TodoEntity.fromJson(todo);
  }
  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.findById(updateTodoDto.id);
    const updateTodo = await prisma.todo.update({
      where: {
        id: todo.id,
      },
      data: updateTodoDto.values,
    });
    return TodoEntity.fromJson(updateTodo);
  }
  async deleteById(id: number): Promise<TodoEntity> {
    await this.findById(id);
    const todoDeleted = await prisma.todo.delete({
      where: {
        id,
      },
    });
    return TodoEntity.fromJson(todoDeleted);
  }
}

import ETodo from "../entities/todo";
import { PrismaClient } from "@prisma/client";

export default class TodoManager {
  private store: PrismaClient;
  constructor(store: PrismaClient) {
    this.store = store;
  }
  async CreateTodo(title: string, description?: string): Promise<ETodo> {
    return this.store.todos.create({ data: { title, description } });
  }
  GetTodoByID(id: number): Promise<ETodo | null> {
    return this.store.todos.findUnique({ where: { id: id } });
  }
  GetManyTodo(limit: number, offset: number): Promise<ETodo[]> {
    return this.store.todos.findMany({ take: limit, skip: offset });
  }
  DeleteTodoByID(id: number): Promise<ETodo> {
    return this.store.todos.delete({ where: { id } });
  }
}

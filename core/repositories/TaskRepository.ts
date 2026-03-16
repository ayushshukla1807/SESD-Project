import { IRepository } from './IRepository';
import { Task } from '../models/Task';
import { Database } from '../db/Database';

export class TaskRepository implements IRepository<Task> {
  private get db() { return Database.getInstance().tasks; }

  findById(id: string): Task | null {
    return this.db.get(id) || null;
  }

  findAll(): Task[] {
    return Array.from(this.db.values());
  }

  save(task: Task): Task {
    this.db.set(task.id, task);
    return task;
  }

  delete(id: string): boolean {
    return this.db.delete(id);
  }
}

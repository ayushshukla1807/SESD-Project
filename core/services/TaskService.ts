import { TaskRepository } from '../repositories/TaskRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Task, TaskStatus } from '../models/Task';

export class TaskService {
  private taskRepo = new TaskRepository();
  private userRepo = new UserRepository();

  public assignTask(adminId: string, title: string, projectId: string, developerId: string): Task {
    const admin = this.userRepo.findById(adminId);
    if (!admin || admin.role !== 'Admin') {
      throw new Error('Only Admins can assign tasks');
    }
    
    const task = new Task(
      Math.random().toString(36).substr(2, 9),
      title,
      'TODO',
      projectId,
      developerId
    );
    
    return this.taskRepo.save(task);
  }

  public updateTaskStatus(developerId: string, taskId: string, status: TaskStatus): Task {
    const dev = this.userRepo.findById(developerId);
    if (!dev || dev.role !== 'Developer') {
      throw new Error('Only Developers can update statuses directly through this workflow');
    }

    const task = this.taskRepo.findById(taskId);
    if (!task) throw new Error('Task not found');
    
    if (task.developerId !== developerId) {
      throw new Error('Cannot update task assigned to someone else');
    }

    task.updateStatus(status);
    return this.taskRepo.save(task);
  }

  public getAllTasks(): Task[] {
    return this.taskRepo.findAll();
  }
}

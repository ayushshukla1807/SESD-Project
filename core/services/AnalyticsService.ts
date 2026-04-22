import { TaskRepository } from '../repositories/TaskRepository';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { TaskStatus } from '../models/Task';

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  velocity: number; // tasks per day (simulated)
  completionRate: number;
  health: 'Healthy' | 'At Risk' | 'Delayed';
}

export class AnalyticsService {
  constructor(
    private taskRepo: TaskRepository = new TaskRepository(),
    private projectRepo: ProjectRepository = new ProjectRepository()
  ) {}

  public getGlobalStats() {
    const tasks = this.taskRepo.findAll();
    const completed = tasks.filter(t => t.status === 'DONE').length;
    
    return {
      totalProjects: this.projectRepo.findAll().length,
      totalTasks: tasks.length,
      completedPercentage: tasks.length > 0 ? (completed / tasks.length) * 100 : 0,
      activeDevelopers: new Set(tasks.map(t => t.developerId).filter(Boolean)).size,
    };
  }

  public getProjectStats(projectId: string): ProjectStats {
    const projectTasks = this.taskRepo.findAll().filter(t => t.projectId === projectId);
    const completedTasks = projectTasks.filter(t => t.status === 'DONE').length;
    const totalTasks = projectTasks.length;
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    let health: 'Healthy' | 'At Risk' | 'Delayed' = 'Healthy';
    if (completionRate < 30 && totalTasks > 5) health = 'At Risk';
    if (completionRate < 10 && totalTasks > 2) health = 'Delayed';

    return {
      totalTasks,
      completedTasks,
      completionRate,
      velocity: parseFloat((completedTasks / 7).toFixed(2)), // Simple simulation
      health
    };
  }

  public getWeeklyActivity() {
    // Simulated data for charts
    return [
      { day: 'Mon', tasks: 12 },
      { day: 'Tue', tasks: 19 },
      { day: 'Wed', tasks: 15 },
      { day: 'Thu', tasks: 22 },
      { day: 'Fri', tasks: 30 },
      { day: 'Sat', tasks: 8 },
      { day: 'Sun', tasks: 5 },
    ];
  }
}

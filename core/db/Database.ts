import { User, Admin, Developer } from '../models/User';
import { Task } from '../models/Task';
import { Project } from '../models/Task';

export class Database {
  private static instance: Database;
  
  public users: Map<string, User> = new Map();
  public projects: Map<string, Project> = new Map();
  public tasks: Map<string, Task> = new Map();

  private constructor() {
    // Seed initial data
    this.users.set('admin1', new Admin('admin1', 'Super Admin'));
    this.users.set('dev1', new Developer('dev1', 'Alice'));
    this.users.set('dev2', new Developer('dev2', 'Bob'));
    
    this.projects.set('proj1', new Project('proj1', 'SESD Final Project', 'admin1'));
    this.tasks.set('task1', new Task('task1', 'Initialize Next.js', 'DONE', 'proj1', 'dev1'));
    this.tasks.set('task2', new Task('task2', 'Write UML Diagrams', 'DONE', 'proj1', 'dev1'));
    this.tasks.set('task3', new Task('task3', 'Implement Architecture', 'IN_PROGRESS', 'proj1', 'dev2'));
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

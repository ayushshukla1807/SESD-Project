import { IRepository } from './IRepository';
import { Project } from '../models/Task';
import { Database } from '../db/Database';

export class ProjectRepository implements IRepository<Project> {
  private get db() { return Database.getInstance().projects; }

  findById(id: string): Project | null {
    return this.db.get(id) || null;
  }

  findAll(): Project[] {
    return Array.from(this.db.values());
  }

  save(project: Project): Project {
    this.db.set(project.id, project);
    return project;
  }

  delete(id: string): boolean {
    return this.db.delete(id);
  }
}

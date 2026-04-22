import { ProjectRepository } from '../repositories/ProjectRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Project } from '../models/Task';

export class ProjectService {
  constructor(
    private projectRepo: ProjectRepository = new ProjectRepository(),
    private userRepo: UserRepository = new UserRepository()
  ) {}

  public createProject(adminId: string, title: string): Project {
    const admin = this.userRepo.findById(adminId);
    if (!admin || admin.role !== 'Admin') {
      throw new Error('Only Admins can create projects');
    }

    const project = new Project(
      Math.random().toString(36).substr(2, 9),
      title,
      adminId
    );

    return this.projectRepo.save(project);
  }

  public getAllProjects(): Project[] {
    return this.projectRepo.findAll();
  }

  public getProjectById(id: string): Project | null {
    return this.projectRepo.findById(id);
  }
}

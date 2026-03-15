export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public status: TaskStatus,
    public projectId: string,
    public developerId: string | null = null
  ) {}

  updateStatus(newStatus: TaskStatus): void {
    this.status = newStatus;
  }
}

export class Project {
  constructor(
    public readonly id: string,
    public title: string,
    public adminId: string
  ) {}
}

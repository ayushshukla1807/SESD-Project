export abstract class User {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly role: 'Admin' | 'Developer'
  ) {}

  abstract getPermissions(): string[];
}

export class Admin extends User {
  constructor(id: string, name: string) {
    super(id, name, 'Admin');
  }

  getPermissions(): string[] {
    return ['CREATE_PROJECT', 'ASSIGN_TASK', 'VIEW_ALL'];
  }
}

export class Developer extends User {
  constructor(id: string, name: string) {
    super(id, name, 'Developer');
  }

  getPermissions(): string[] {
    return ['UPDATE_TASK_STATUS', 'VIEW_ASSIGNED'];
  }
}

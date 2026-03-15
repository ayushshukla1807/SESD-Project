import { IRepository } from './IRepository';
import { User } from '../models/User';
import { Database } from '../db/Database';

export class UserRepository implements IRepository<User> {
  private get db() { return Database.getInstance().users; }

  findById(id: string): User | null {
    return this.db.get(id) || null;
  }

  findAll(): User[] {
    return Array.from(this.db.values());
  }

  save(user: User): User {
    this.db.set(user.id, user);
    return user;
  }

  delete(id: string): boolean {
    return this.db.delete(id);
  }
}

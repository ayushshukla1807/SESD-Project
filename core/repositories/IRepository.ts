export interface IRepository<T> {
  findById(id: string): T | null;
  findAll(): T[];
  save(entity: T): T;
  delete(id: string): boolean;
}

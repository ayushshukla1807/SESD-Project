export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  entityType: 'TASK' | 'PROJECT' | 'USER';
  entityId: string;
  details: string;
}

export class AuditService {
  private logs: AuditLogEntry[] = [];
  private static instance: AuditService;

  private constructor() {
    // Seed with some "historical" logs to simulate 6 months of activity
    this.seedLogs();
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    this.logs.unshift(newEntry);
    if (this.logs.length > 100) this.logs.pop(); // Keep last 100
  }

  public getRecentLogs(limit: number = 10): AuditLogEntry[] {
    return this.logs.slice(0, limit);
  }

  private seedLogs() {
    const actions = ['CREATED', 'UPDATED_STATUS', 'ASSIGNED', 'DELETED'];
    const entities = ['TASK', 'PROJECT'] as const;
    const users = ['admin1', 'dev1', 'dev2'];

    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 4); // Spread over a few days
      
      this.logs.push({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: date,
        action: actions[Math.floor(Math.random() * actions.length)],
        userId: users[Math.floor(Math.random() * users.length)],
        entityType: entities[Math.floor(Math.random() * entities.length)],
        entityId: 'id-' + i,
        details: `System auto-generated log entry #${i} for project synchronization.`
      });
    }
  }
}

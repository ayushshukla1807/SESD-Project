export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  private notifications: Notification[] = [];
  private static instance: NotificationService;

  private constructor() {
    this.notifications = [
      {
        id: '1',
        title: 'Welcome to TaskFlow',
        message: 'Your workspace is ready. Check the documentation for core architecture details.',
        type: 'INFO',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      },
      {
        id: '2',
        title: 'Project Milestone Reached',
        message: 'The "Enterprise Integration" milestone has been marked as complete.',
        type: 'SUCCESS',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
      }
    ];
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public getNotifications() {
    return this.notifications;
  }

  public markAsRead(id: string) {
    const n = this.notifications.find(notif => notif.id === id);
    if (n) n.read = true;
  }

  public addNotification(notif: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    this.notifications.unshift({
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      createdAt: new Date()
    });
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
  private notifications: string[] = [];
  private instanceId = Math.floor(Math.random() * 10000);

  constructor() {
    console.log(`NotificationService instance created! ID: ${this.instanceId}`);
  }

  getNotifications(): string[] {
    return this.notifications;
  }

  addNotification(message: string): void {
    this.notifications.push(`${message} [Time: ${new Date().toLocaleTimeString()}]`);
  }

  getInstanceId(): number {
    return this.instanceId;
  }
}

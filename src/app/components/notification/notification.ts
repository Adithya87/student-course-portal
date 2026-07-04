import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
  // Scoping provider to component level (Hands-On 6 Task 2 Step 67)
  providers: [NotificationService]
})
export class Notification implements OnInit {
  notifications: string[] = [];
  instanceId!: number;
  newMsg = '';

  /*
    COMPONENT-LEVEL PROVIDERS (providers: [NotificationService]):
    - By providing the service inside the component's decorator instead of root,
      Angular's hierarchical Injector creates a brand-new, isolated instance of the 
      service specifically for this component instance (and its children).
    - If multiple instances of this component are rendered on the same page,
      each will get its own separate service instance with its own state.
    - When the component is destroyed, this service instance is also garbage-collected,
      preventing memory leaks for component-specific local state.
  */

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
    this.instanceId = this.notificationService.getInstanceId();
    
    // Add default initial message
    this.notificationService.addNotification('System Initialized');
  }

  sendNotification(): void {
    if (this.newMsg.trim()) {
      this.notificationService.addNotification(this.newMsg);
      this.newMsg = '';
    }
  }
}

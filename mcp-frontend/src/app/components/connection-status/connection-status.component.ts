import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { StreamingService } from '../../services/streaming.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connection-status" [class.connected]="isConnected" [class.disconnected]="!isConnected" *ngIf="isBrowser">
      <div class="status-indicator">
        <span class="dot"></span>
        <span class="text">
          {{isConnected ? '🟢 Backend Connected' : '🔴 Backend Disconnected'}}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .connection-status {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .connection-status.connected {
      border-left: 4px solid #10b981;
    }

    .connection-status.disconnected {
      border-left: 4px solid #ef4444;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;
    }

    .disconnected .dot {
      background: #ef4444;
    }

    .text {
      font-weight: 500;
      color: #374151;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @media (max-width: 768px) {
      .connection-status {
        top: 10px;
        right: 10px;
        font-size: 0.8rem;
        padding: 6px 12px;
      }
    }
  `]
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  isConnected: boolean = false;
  isBrowser: boolean;
  private subscription: Subscription = new Subscription();

  constructor(
    private streamingService: StreamingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Try to connect to streaming service
      this.streamingService.connect();
      
      // Check connection status periodically
      setInterval(() => {
        this.isConnected = this.streamingService.isConnected();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.isBrowser) {
      this.streamingService.disconnect();
    }
  }
}

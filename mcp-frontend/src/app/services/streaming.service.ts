import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {
  private eventSource: EventSource | null = null;
  private messageSubject = new Subject<string>();
  public messages$ = this.messageSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  connect(): void {
    // Only attempt SSE connection in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.eventSource) {
      this.disconnect();
    }

    try {
      this.eventSource = new EventSource(`${environment.mcpServerUrl}${environment.sseEndpoint}`);
      
      this.eventSource.onopen = (event) => {
        console.log('SSE connection opened:', event);
      };

      this.eventSource.onmessage = (event) => {
        console.log('SSE message received:', event.data);
        this.messageSubject.next(event.data);
      };

      this.eventSource.onerror = (event) => {
        console.error('SSE error:', event);
        this.disconnect();
      };

    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  isConnected(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }
}

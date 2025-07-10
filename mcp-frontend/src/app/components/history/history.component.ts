import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ChatMessage } from '../../models/interfaces';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="history-container fade-in">
      <div class="history-header card">
        <div class="card-header">
          <div class="header-content">
            <h2 class="card-title">Conversation History</h2>
            <p class="card-subtitle">Review your chat history and interactions</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary" (click)="exportHistory()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Export
            </button>
            <button class="btn btn-danger" (click)="clearHistory()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div class="history-content">
        <div *ngIf="messages.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>No conversation history</h3>
          <p>Start a conversation in the chat to see your history here.</p>
        </div>

        <div class="history-messages" *ngIf="messages.length > 0">
          <div *ngFor="let message of messages; trackBy: trackMessage; let i = index" 
               class="history-message slide-up"
               [class.user-message]="message.isUser"
               [class.ai-message]="!message.isUser">
            
            <div class="message-header">
              <div class="message-avatar">
                <div class="avatar" [class.user-avatar]="message.isUser" [class.ai-avatar]="!message.isUser">
                  <svg *ngIf="message.isUser" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg *ngIf="!message.isUser" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <circle cx="9" cy="9" r="1" fill="currentColor"/>
                    <path d="M13 5.5C13 7.5 14.5 9 16.5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M13 18.5C13 16.5 14.5 15 16.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div class="message-meta">
                <span class="message-type">
                  {{message.isUser ? 'You' : 'AI Assistant'}}
                </span>
                <span class="message-time">
                  {{message.timestamp | date:'medium'}}
                </span>
              </div>
              <div class="message-actions">
                <button class="btn-icon" (click)="copyMessage(message)" [title]="'Copy message'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="btn-icon" (click)="deleteMessage(message.id)" [title]="'Delete message'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="message-content">
              <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>
              
              <div *ngIf="message.tools && message.tools.length > 0" class="tools-used">
                <div class="tools-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.7 6.3C15.4 7 15.4 8.1 14.7 8.8L8.8 14.7C8.1 15.4 7 15.4 6.3 14.7C5.6 14 5.6 12.9 6.3 12.2L12.2 6.3C12.9 5.6 14 5.6 14.7 6.3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Tools Used ({{message.tools.length}})</span>
                </div>
                <div *ngFor="let tool of message.tools" class="tool-call">
                  <div class="tool-name">{{tool.name}}</div>
                  <div *ngIf="tool.arguments" class="tool-section">
                    <span class="tool-label">Arguments:</span>
                    <pre class="tool-data">{{tool.arguments | json}}</pre>
                  </div>
                  <div *ngIf="tool.result" class="tool-section">
                    <span class="tool-label">Result:</span>
                    <pre class="tool-data">{{tool.result | json}}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: var(--space-6);
    }

    .history-header {
      margin-bottom: var(--space-6);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-6);
    }

    .header-content h2 {
      margin: 0 0 var(--space-1) 0;
    }

    .header-content p {
      margin: 0;
      color: var(--text-secondary);
    }

    .header-actions {
      display: flex;
      gap: var(--space-3);
    }

    .history-content {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }

    .empty-state {
      text-align: center;
      padding: var(--space-12);
      color: var(--text-secondary);
    }

    .empty-icon {
      margin-bottom: var(--space-4);
      color: var(--text-tertiary);
    }

    .empty-state h3 {
      margin: 0 0 var(--space-2) 0;
      color: var(--text-primary);
    }

    .empty-state p {
      margin: 0;
    }

    .history-messages {
      padding: var(--space-6);
    }

    .history-message {
      border-bottom: 1px solid var(--border-color);
      padding: var(--space-6) 0;
      transition: var(--transition-all);
    }

    .history-message:last-child {
      border-bottom: none;
    }

    .history-message:hover {
      background: var(--bg-secondary);
      margin: 0 calc(-1 * var(--space-6));
      padding: var(--space-6);
      border-radius: var(--border-radius-md);
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .message-avatar {
      flex-shrink: 0;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-avatar {
      background: var(--accent-blue);
    }

    .ai-avatar {
      background: var(--accent-purple);
    }

    .message-meta {
      flex: 1;
    }

    .message-type {
      font-weight: 600;
      color: var(--text-primary);
      display: block;
      margin-bottom: var(--space-1);
    }

    .message-time {
      color: var(--text-tertiary);
      font-size: 0.875rem;
    }

    .message-actions {
      display: flex;
      gap: var(--space-1);
    }

    .btn-icon {
      background: none;
      border: none;
      padding: var(--space-2);
      border-radius: var(--border-radius-md);
      color: var(--text-tertiary);
      cursor: pointer;
      transition: var(--transition-all);
    }

    .btn-icon:hover {
      background: var(--secondary-100);
      color: var(--text-secondary);
    }

    .message-content {
      margin-left: calc(40px + var(--space-3));
    }

    .message-text {
      color: var(--text-primary);
      line-height: 1.6;
      margin-bottom: var(--space-3);
    }

    .tools-used {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-md);
      padding: var(--space-4);
      margin-top: var(--space-3);
    }

    .tools-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-3);
      font-weight: 600;
      color: var(--text-primary);
    }

    .tools-header svg {
      color: var(--primary-500);
    }

    .tool-call {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      padding: var(--space-3);
      margin-bottom: var(--space-2);
    }

    .tool-call:last-child {
      margin-bottom: 0;
    }

    .tool-name {
      font-weight: 600;
      color: var(--primary-600);
      margin-bottom: var(--space-2);
    }

    .tool-section {
      margin-bottom: var(--space-2);
    }

    .tool-section:last-child {
      margin-bottom: 0;
    }

    .tool-label {
      font-weight: 500;
      color: var(--text-secondary);
      font-size: 0.875rem;
      display: block;
      margin-bottom: var(--space-1);
    }

    .tool-data {
      background: var(--secondary-100);
      padding: var(--space-2);
      border-radius: var(--border-radius-sm);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-primary);
      margin: 0;
      white-space: pre-wrap;
      overflow-x: auto;
    }

    @media (max-width: 768px) {
      .history-container {
        padding: var(--space-4);
      }

      .card-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-4);
      }

      .header-actions {
        justify-content: center;
      }

      .history-messages {
        padding: var(--space-4);
      }

      .history-message {
        padding: var(--space-4) 0;
      }

      .history-message:hover {
        margin: 0 calc(-1 * var(--space-4));
        padding: var(--space-4);
      }

      .message-content {
        margin-left: 0;
        margin-top: var(--space-3);
      }
    }
  `]
})
export class HistoryComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  
  private messagesSubscription: Subscription | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.subscribeToMessages();
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  private loadMessages(): void {
    // Load messages from localStorage or service
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }
  }

  private subscribeToMessages(): void {
    // Subscribe to messages updates from the chat service
    this.messagesSubscription = this.apiService.messages$.subscribe((messages: ChatMessage[]) => {
      this.messages = messages;
    });
  }

  trackMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  formatMessage(content: string): string {
    // Basic HTML formatting for messages
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  copyMessage(message: ChatMessage): void {
    navigator.clipboard.writeText(message.content).then(() => {
      console.log('Message copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy message:', err);
    });
  }

  deleteMessage(messageId: string): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messages = this.messages.filter(msg => msg.id !== messageId);
      localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }
  }

  exportHistory(): void {
    const dataStr = JSON.stringify(this.messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all conversation history? This action cannot be undone.')) {
      this.messages = [];
      localStorage.removeItem('chatMessages');
    }
  }
}

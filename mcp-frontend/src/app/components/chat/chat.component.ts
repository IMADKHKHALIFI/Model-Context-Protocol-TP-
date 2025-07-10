import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ChatMessage } from '../../models/interfaces';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container fade-in">
      <div class="chat-header card">
        <div class="card-header">
          <h2 class="card-title">AI Assistant</h2>
          <p class="card-subtitle">Ask questions and get intelligent responses using MCP tools</p>
        </div>
        <div class="chat-actions">
          <button class="btn btn-secondary" (click)="clearChat()" [disabled]="messages.length === 0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Clear Chat
          </button>
        </div>
      </div>

      <div class="chat-messages-container card">
        <div class="chat-messages" #messagesContainer>
          <div *ngFor="let message of messages; trackBy: trackMessage" 
               class="message slide-up"
               [class.user-message]="message.isUser"
               [class.ai-message]="!message.isUser">
            
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

            <div class="message-content">
              <div class="message-header">
                <span class="message-sender">{{message.isUser ? 'You' : 'AI Assistant'}}</span>
                <span class="message-time">{{message.timestamp | date:'short'}}</span>
              </div>
              
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

              <div *ngIf="message.isStreaming" class="streaming-indicator">
                <div class="loading-spinner"></div>
                <span>AI is processing...</span>
              </div>
            </div>
          </div>

          <div *ngIf="messages.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Start a conversation</h3>
            <p>Ask me anything! I can help you with:</p>
            <div class="capabilities">
              <div class="capability">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14C19 15.1 18.1 16 17 16H5L3 18V6C3 4.9 3.9 4 5 4H17C18.1 4 19 4.9 19 6V14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Company information and stock data
              </div>
              <div class="capability">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Employee information
              </div>
              <div class="capability">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                File system operations
              </div>
              <div class="capability">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.5142 22.4142C13.1591 22.7893 12.6504 23 12.12 23C11.5896 23 11.0809 22.7893 10.7258 22.4142C10.3707 22.0391 10.16 21.5304 10.16 21V20.91C10.1549 20.579 10.0523 20.2573 9.86631 19.9833C9.68035 19.7094 9.41973 19.495 9.12 19.37C8.81838 19.2369 8.48382 19.1972 8.15941 19.256C7.83498 19.3148 7.53568 19.4695 7.3 19.7L7.24 19.76C7.05429 19.946 6.83368 20.0935 6.59088 20.1941C6.34808 20.2948 6.08783 20.3466 5.825 20.3466C5.56217 20.3466 5.30192 20.2948 5.05912 20.1941C4.81632 20.0935 4.59571 19.946 4.41 19.76C4.224 19.5743 4.0765 19.3537 3.97583 19.1109C3.87517 18.8681 3.82343 18.6078 3.82343 18.345C3.82343 18.0822 3.87517 17.8219 3.97583 17.5791C4.0765 17.3363 4.224 17.1157 4.41 16.93L4.47 16.87C4.70049 16.6343 4.85519 16.335 4.914 16.0106C4.97282 15.6862 4.93312 15.3516 4.8 15.05C4.67324 14.7542 4.46276 14.502 4.19447 14.3243C3.92618 14.1466 3.61179 14.0513 3.29 14.05H3.2C2.66957 14.05 2.16086 13.8393 1.78579 13.4842C1.41071 13.1291 1.2 12.6204 1.2 12.09C1.2 11.5596 1.41071 11.0509 1.78579 10.6958C2.16086 10.3407 2.66957 10.13 3.2 10.13H3.29C3.62099 10.1249 3.94269 10.0223 4.21665 9.83627C4.49061 9.65031 4.70498 9.38969 4.83 9.09C4.96312 8.78838 5.00282 8.45382 4.944 8.12941C4.88519 7.80498 4.73049 7.50568 4.5 7.27L4.44 7.21C4.254 7.02429 4.1065 6.80368 4.00583 6.56088C3.90517 6.31808 3.85343 6.05783 3.85343 5.795C3.85343 5.53217 3.90517 5.27192 4.00583 5.02912C4.1065 4.78632 4.254 4.56571 4.44 4.38C4.62571 4.194 4.84632 4.0465 5.08912 3.94583C5.33192 3.84517 5.59217 3.79343 5.855 3.79343C6.11783 3.79343 6.37808 3.84517 6.62088 3.94583C6.86368 4.0465 7.08429 4.194 7.27 4.38L7.33 4.44C7.56568 4.67049 7.865 4.82519 8.18941 4.884C8.51382 4.94282 8.84838 4.90312 9.15 4.77C9.44582 4.64324 9.69802 4.43276 9.87571 4.16447C10.0534 3.89618 10.1487 3.58179 10.15 3.26V3.2C10.15 2.66957 10.3607 2.16086 10.7158 1.78579C11.0709 1.41071 11.5796 1.2 12.11 1.2C12.6404 1.2 13.1491 1.41071 13.5042 1.78579C13.8593 2.16086 14.07 2.66957 14.07 3.2V3.29C14.0713 3.61179 14.1666 3.92618 14.3443 4.19447C14.522 4.46276 14.7742 4.67324 15.07 4.8C15.3716 4.93312 15.7062 4.97282 16.0306 4.914C16.355 4.85519 16.6543 4.70049 16.89 4.47L16.95 4.41C17.1357 4.224 17.3563 4.0765 17.5991 3.97583C17.8419 3.87517 18.1022 3.82343 18.365 3.82343C18.6278 3.82343 18.8881 3.87517 19.1309 3.97583C19.3737 4.0765 19.5943 4.224 19.78 4.41C19.966 4.59571 20.1135 4.81632 20.2141 5.05912C20.3148 5.30192 20.3666 5.56217 20.3666 5.825C20.3666 6.08783 20.3148 6.34808 20.2141 6.59088C20.1135 6.83368 19.966 7.05429 19.78 7.24L19.72 7.3C19.4895 7.53568 19.3348 7.835 19.276 8.15941C19.2172 8.48382 19.2569 8.81838 19.39 9.12C19.5168 9.41582 19.7272 9.66802 19.9955 9.84571C20.2638 10.0234 20.5782 10.1187 20.9 10.12H21C21.5304 10.12 22.0391 10.3307 22.4142 10.6858C22.7893 11.0409 23 11.5496 23 12.08C23 12.6104 22.7893 13.1191 22.4142 13.4742C22.0391 13.8293 21.5304 14.04 21 14.04H20.91C20.5882 14.0413 20.2738 14.1366 20.0055 14.3143C19.7372 14.492 19.5268 14.7442 19.4 15.04Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                General questions and assistance
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-container card">
        <form (ngSubmit)="sendMessage()" class="chat-input-form">
          <div class="input-wrapper">
            <textarea
              [(ngModel)]="currentMessage"
              name="message"
              placeholder="Type your message here..."
              class="message-input"
              [disabled]="isLoading"
              #messageInput
              rows="1"
              (keydown.enter)="onEnterKey($event)"></textarea>
            <button 
              type="submit" 
              class="send-button"
              [disabled]="!currentMessage.trim() || isLoading">
              <svg *ngIf="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2" fill="currentColor"/>
              </svg>
              <div *ngIf="isLoading" class="loading-spinner"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      max-width: 800px;
      margin: 0 auto;
      height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      background: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .chat-subtitle {
      color: #7f8c8d;
      margin: 4px 0 0 0;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    .message {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
    }

    .user-message {
      align-items: flex-end;
    }

    .ai-message {
      align-items: flex-start;
    }

    .message-content {
      max-width: 70%;
      background: #f8f9fa;
      padding: 16px 20px;
      border-radius: 18px;
      position: relative;
    }

    .user-message .message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 6px;
    }

    .ai-message .message-content {
      background: #f8f9fa;
      border-bottom-left-radius: 6px;
    }

    .message-text {
      line-height: 1.5;
      word-wrap: break-word;
    }

    .tools-used {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .user-message .tools-used {
      border-top-color: rgba(255, 255, 255, 0.2);
    }

    .tools-used h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
    }

    .tool-call {
      background: rgba(0, 0, 0, 0.05);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
    }

    .user-message .tool-call {
      background: rgba(255, 255, 255, 0.1);
    }

    .tool-call pre {
      background: rgba(0, 0, 0, 0.05);
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      margin: 8px 0;
      overflow-x: auto;
    }

    .user-message .tool-call pre {
      background: rgba(255, 255, 255, 0.1);
    }

    .tool-result {
      margin-top: 8px;
    }

    .message-time {
      font-size: 12px;
      color: #7f8c8d;
      margin-top: 8px;
    }

    .user-message .message-time {
      color: rgba(255, 255, 255, 0.8);
    }

    .streaming-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 14px;
      color: #7f8c8d;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #7f8c8d;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 16px;
    }

    .empty-state ul {
      text-align: left;
      max-width: 300px;
      margin: 20px auto;
    }

    .empty-state li {
      margin-bottom: 8px;
    }

    .chat-input {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .input-form {
      width: 100%;
    }

    .input-group {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .input-group .form-control {
      flex: 1;
      margin-bottom: 0;
    }

    .input-group .btn {
      white-space: nowrap;
      min-width: 100px;
    }

    /* Scrollbar styling */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    @media (max-width: 768px) {
      .chat-container {
        height: calc(100vh - 100px);
      }
      
      .chat-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
      
      .message-content {
        max-width: 85%;
      }
      
      .input-group {
        flex-direction: column;
      }
      
      .input-group .btn {
        width: 100%;
        min-width: auto;
      }
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  private subscription: Subscription = new Subscription();
  private shouldScrollToBottom: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.apiService.messages$.subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      })
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage: ChatMessage = {
      id: this.apiService.generateId(),
      content: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    this.apiService.addMessage(userMessage);
    const query = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    // Add AI message with streaming indicator
    const aiMessage: ChatMessage = {
      id: this.apiService.generateId(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true
    };

    this.apiService.addMessage(aiMessage);

    this.subscription.add(
      this.apiService.sendChatMessage(query).subscribe({
        next: (response) => {
          this.apiService.updateMessage(aiMessage.id, {
            content: response,
            isStreaming: false
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Chat error:', error);
          this.apiService.updateMessage(aiMessage.id, {
            content: '❌ Sorry, I encountered an error. Please try again.',
            isStreaming: false
          });
          this.isLoading = false;
        }
      })
    );
  }

  clearChat(): void {
    this.apiService.clearMessages();
  }

  formatMessage(content: string): string {
    // Simple formatting for better readability
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  trackMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) {
      // Allow shift+enter for new lines
      return;
    }
    
    event.preventDefault();
    this.sendMessage();
  }
}

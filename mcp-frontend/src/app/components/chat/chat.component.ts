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
    <div class="chat-container">
      <div class="chat-header">
        <h2>💬 AI Chat Assistant</h2>
        <p class="chat-subtitle">Ask questions and get answers using MCP tools</p>
        <button class="btn btn-secondary" (click)="clearChat()">
          🗑️ Clear Chat
        </button>
      </div>

      <div class="chat-messages" #messagesContainer>
        <div *ngFor="let message of messages; trackBy: trackMessage" 
             class="message" 
             [class.user-message]="message.isUser"
             [class.ai-message]="!message.isUser">
          
          <div class="message-content">
            <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>
            
            <div *ngIf="message.tools && message.tools.length > 0" class="tools-used">
              <h4>🔧 Tools Used:</h4>
              <div *ngFor="let tool of message.tools" class="tool-call">
                <strong>{{tool.name}}</strong>
                <pre *ngIf="tool.arguments">{{tool.arguments | json}}</pre>
                <div *ngIf="tool.result" class="tool-result">
                  <strong>Result:</strong>
                  <pre>{{tool.result | json}}</pre>
                </div>
              </div>
            </div>

            <div class="message-time">
              {{message.timestamp | date:'short'}}
            </div>
          </div>

          <div *ngIf="message.isStreaming" class="streaming-indicator">
            <div class="loading-spinner"></div>
            <span>AI is thinking...</span>
          </div>
        </div>

        <div *ngIf="messages.length === 0" class="empty-state">
          <div class="empty-icon">🤖</div>
          <h3>Start a conversation</h3>
          <p>Ask me anything! I can help you with:</p>
          <ul>
            <li>📊 Company information and stock data</li>
            <li>👥 Employee information</li>
            <li>📁 File system operations</li>
            <li>🔍 General questions and assistance</li>
          </ul>
        </div>
      </div>

      <div class="chat-input">
        <form (ngSubmit)="sendMessage()" class="input-form">
          <div class="input-group">
            <input
              type="text"
              [(ngModel)]="currentMessage"
              name="message"
              placeholder="Type your message here..."
              class="form-control"
              [disabled]="isLoading"
              #messageInput>
            <button type="submit" 
                    class="btn btn-primary" 
                    [disabled]="!currentMessage.trim() || isLoading">
              <span *ngIf="!isLoading">Send 🚀</span>
              <span *ngIf="isLoading">
                <div class="loading-spinner"></div>
              </span>
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
}

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
    <div class="history-container">
      <div class="history-header">
        <h2>📝 Conversation History</h2>
        <p class="history-subtitle">Review your chat history and interactions</p>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="exportHistory()">
            📄 Export
          </button>
          <button class="btn btn-danger" (click)="clearHistory()">
            🗑️ Clear All
          </button>
        </div>
      </div>

      <div class="history-filters">
        <div class="filter-group">
          <label>Filter by type:</label>
          <select [(ngModel)]="filterType" (change)="applyFilters()" class="form-control">
            <option value="all">All Messages</option>
            <option value="user">User Messages</option>
            <option value="ai">AI Responses</option>
            <option value="tools">Messages with Tools</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Search:</label>
          <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()" 
                 placeholder="Search in messages..." class="form-control">
        </div>
      </div>

      <div class="history-stats" *ngIf="messages.length > 0">
        <div class="stat-card">
          <h4>{{getTotalMessages()}}</h4>
          <p>Total Messages</p>
        </div>
        <div class="stat-card">
          <h4>{{getUserMessages()}}</h4>
          <p>User Queries</p>
        </div>
        <div class="stat-card">
          <h4>{{getAIMessages()}}</h4>
          <p>AI Responses</p>
        </div>
        <div class="stat-card">
          <h4>{{getToolMessages()}}</h4>
          <p>Tool Calls</p>
        </div>
      </div>

      <div class="history-content">
        <div *ngIf="filteredMessages.length === 0 && messages.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No conversation history</h3>
          <p>Start a conversation in the chat to see your history here.</p>
        </div>

        <div *ngIf="filteredMessages.length === 0 && messages.length > 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No messages found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>

        <div class="history-messages">
          <div *ngFor="let message of filteredMessages; trackBy: trackMessage; let i = index" 
               class="history-message"
               [class.user-message]="message.isUser"
               [class.ai-message]="!message.isUser">
            
            <div class="message-header">
              <div class="message-meta">
                <span class="message-type">
                  {{message.isUser ? '👤 User' : '🤖 AI Assistant'}}
                </span>
                <span class="message-time">
                  {{message.timestamp | date:'medium'}}
                </span>
              </div>
              <div class="message-actions">
                <button class="btn-icon" (click)="copyMessage(message)" title="Copy message">
                  📋
                </button>
                <button class="btn-icon" (click)="deleteMessage(message.id)" title="Delete message">
                  🗑️
                </button>
              </div>
            </div>

            <div class="message-content">
              <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>
              
              <div *ngIf="message.tools && message.tools.length > 0" class="tools-section">
                <h5>🔧 Tools Used ({{message.tools.length}}):</h5>
                <div *ngFor="let tool of message.tools" class="tool-item">
                  <div class="tool-header">
                    <strong>{{tool.name}}</strong>
                  </div>
                  <div *ngIf="tool.arguments" class="tool-args">
                    <span class="label">Arguments:</span>
                    <pre>{{formatJSON(tool.arguments)}}</pre>
                  </div>
                  <div *ngIf="tool.result" class="tool-result">
                    <span class="label">Result:</span>
                    <pre>{{formatJSON(tool.result)}}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="history-pagination" *ngIf="filteredMessages.length > messagesPerPage">
        <div class="pagination-info">
          Showing {{(currentPage - 1) * messagesPerPage + 1}} - 
          {{Math.min(currentPage * messagesPerPage, filteredMessages.length)}} 
          of {{filteredMessages.length}} messages
        </div>
        <div class="pagination-controls">
          <button class="btn btn-secondary" 
                  [disabled]="currentPage === 1" 
                  (click)="previousPage()">
            ← Previous
          </button>
          <span class="page-info">Page {{currentPage}} of {{totalPages}}</span>
          <button class="btn btn-secondary" 
                  [disabled]="currentPage === totalPages" 
                  (click)="nextPage()">
            Next →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .history-header {
      background: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }

    .history-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .history-subtitle {
      color: #7f8c8d;
      margin: 4px 0 0 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .history-filters {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
    }

    .history-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stat-card h4 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      color: #667eea;
      font-weight: 700;
    }

    .stat-card p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .history-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
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
      margin-bottom: 12px;
    }

    .history-messages {
      max-height: 600px;
      overflow-y: auto;
    }

    .history-message {
      border-bottom: 1px solid #f1f1f1;
      padding: 24px;
      transition: background-color 0.2s ease;
    }

    .history-message:hover {
      background-color: #f8f9fa;
    }

    .history-message:last-child {
      border-bottom: none;
    }

    .user-message {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .message-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .message-type {
      font-weight: 600;
      color: #2c3e50;
    }

    .message-time {
      color: #7f8c8d;
      font-size: 0.875rem;
    }

    .message-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }

    .btn-icon:hover {
      background-color: #e9ecef;
    }

    .message-content {
      line-height: 1.6;
    }

    .message-text {
      margin-bottom: 16px;
      word-wrap: break-word;
    }

    .tools-section {
      background: rgba(0, 0, 0, 0.02);
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .tools-section h5 {
      margin: 0 0 12px 0;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .tool-item {
      background: white;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      border: 1px solid #e1e8ed;
    }

    .tool-item:last-child {
      margin-bottom: 0;
    }

    .tool-header {
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
    }

    .tool-args, .tool-result {
      margin-bottom: 8px;
    }

    .tool-args:last-child, .tool-result:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 500;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .tool-args pre, .tool-result pre {
      background: #f8f9fa;
      padding: 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      margin: 4px 0 0 0;
      overflow-x: auto;
      max-height: 120px;
      overflow-y: auto;
    }

    .history-pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #f8f9fa;
      border-top: 1px solid #e1e8ed;
    }

    .pagination-info {
      color: #7f8c8d;
      font-size: 0.875rem;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .page-info {
      color: #495057;
      font-weight: 500;
    }

    /* Scrollbar styling */
    .history-messages::-webkit-scrollbar {
      width: 6px;
    }

    .history-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .history-messages::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .history-messages::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    @media (max-width: 768px) {
      .history-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .history-filters {
        flex-direction: column;
        gap: 16px;
      }
      
      .filter-group {
        min-width: auto;
      }
      
      .history-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .message-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .history-pagination {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class HistoryComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  filteredMessages: ChatMessage[] = [];
  filterType: string = 'all';
  searchTerm: string = '';
  currentPage: number = 1;
  messagesPerPage: number = 10;
  totalPages: number = 1;
  
  private subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.apiService.messages$.subscribe(messages => {
        this.messages = messages;
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  applyFilters(): void {
    let filtered = [...this.messages];

    // Apply type filter
    if (this.filterType !== 'all') {
      switch (this.filterType) {
        case 'user':
          filtered = filtered.filter(msg => msg.isUser);
          break;
        case 'ai':
          filtered = filtered.filter(msg => !msg.isUser);
          break;
        case 'tools':
          filtered = filtered.filter(msg => msg.tools && msg.tools.length > 0);
          break;
      }
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.content.toLowerCase().includes(searchLower) ||
        (msg.tools && msg.tools.some(tool => 
          tool.name.toLowerCase().includes(searchLower)
        ))
      );
    }

    this.filteredMessages = filtered.reverse(); // Show newest first
    this.totalPages = Math.ceil(this.filteredMessages.length / this.messagesPerPage);
    this.currentPage = 1;
  }

  getTotalMessages(): number {
    return this.messages.length;
  }

  getUserMessages(): number {
    return this.messages.filter(msg => msg.isUser).length;
  }

  getAIMessages(): number {
    return this.messages.filter(msg => !msg.isUser).length;
  }

  getToolMessages(): number {
    return this.messages.filter(msg => msg.tools && msg.tools.length > 0).length;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  copyMessage(message: ChatMessage): void {
    navigator.clipboard.writeText(message.content).then(() => {
      // You could show a toast notification here
      console.log('Message copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy message:', err);
    });
  }

  deleteMessage(messageId: string): void {
    if (confirm('Are you sure you want to delete this message?')) {
      // Remove from current messages
      const currentMessages = this.apiService.getMessages();
      const updatedMessages = currentMessages.filter(msg => msg.id !== messageId);
      
      // Update the service (you might need to add a method for this)
      this.apiService.clearMessages();
      updatedMessages.forEach(msg => this.apiService.addMessage(msg));
    }
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all conversation history? This action cannot be undone.')) {
      this.apiService.clearMessages();
    }
  }

  exportHistory(): void {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalMessages: this.messages.length,
      messages: this.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.isUser,
        timestamp: msg.timestamp,
        tools: msg.tools
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mcp-chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  formatMessage(content: string): string {
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  formatJSON(obj: any): string {
    if (typeof obj === 'string') {
      return obj;
    }
    return JSON.stringify(obj, null, 2);
  }

  trackMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  get Math() {
    return Math;
  }
}

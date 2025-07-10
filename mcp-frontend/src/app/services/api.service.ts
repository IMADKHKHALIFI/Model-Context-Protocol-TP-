import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChatMessage, ChatRequest, ChatResponse, McpTool, Company, Stock, Employee } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chat endpoint
  sendChatMessage(query: string): Observable<string> {
    const params = new HttpParams().set('query', query);
    return this.http.get<string>(`${this.baseUrl}/chat`, { 
      params,
      responseType: 'text' as 'json'
    });
  }

  // Server-Sent Events for streaming
  connectToSSE(): EventSource {
    return new EventSource(`${environment.mcpServerUrl}${environment.sseEndpoint}`);
  }

  // Tools endpoints
  getAvailableTools(): Observable<McpTool[]> {
    return this.http.get<McpTool[]>(`${this.baseUrl}/tools`);
  }

  // MCP Server endpoints (if exposed via REST)
  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/mcp/companies`);
  }

  getCompanyByName(name: string): Observable<Company> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Company>(`${this.baseUrl}/mcp/company`, { params });
  }

  getStockByCompanyName(name: string): Observable<Stock> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Stock>(`${this.baseUrl}/mcp/stock`, { params });
  }

  getEmployeeInfo(name: string): Observable<Employee> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Employee>(`${this.baseUrl}/python/employee`, { params });
  }

  // Filesystem operations
  listFiles(path: string): Observable<string[]> {
    const params = new HttpParams().set('path', path);
    return this.http.get<string[]>(`${this.baseUrl}/filesystem/list`, { params });
  }

  readFile(path: string): Observable<string> {
    const params = new HttpParams().set('path', path);
    return this.http.get<string>(`${this.baseUrl}/filesystem/read`, { 
      params,
      responseType: 'text' as 'json'
    });
  }

  // Message management
  addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  updateMessage(messageId: string, updates: Partial<ChatMessage>): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    );
    this.messagesSubject.next(updatedMessages);
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }

  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  // Utility method to generate unique IDs
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

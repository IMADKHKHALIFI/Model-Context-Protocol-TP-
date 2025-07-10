export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  tools?: ToolCall[];
}

export interface ToolCall {
  name: string;
  arguments: any;
  result?: any;
}

export interface McpTool {
  name: string;
  description: string;
  parameters?: any;
  type: 'python' | 'nodejs' | 'java';
  server: string;
}

export interface ChatRequest {
  query: string;
  conversationId?: string;
}

export interface ChatResponse {
  content: string;
  tools?: ToolCall[];
  conversationId: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface Employee {
  name: string;
  salary: string;
}

export interface Company {
  name: string;
  activity: string;
  turnover: number;
  employesCount: number;
  country: string;
}

export interface Stock {
  companyName: string;
  date: string;
  stock: number;
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { McpTool, Company, Stock, Employee } from '../../models/interfaces';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tools-container">
      <div class="tools-header">
        <h2>🔧 Available Tools</h2>
        <p class="tools-subtitle">Test and explore MCP tools directly</p>
      </div>

      <div class="tools-grid">
        <!-- Java MCP Server Tools -->
        <div class="tool-card">
          <h3>📊 Company Tools (Java MCP Server)</h3>
          <div class="tool-actions">
            <button class="btn btn-primary" (click)="getAllCompanies()">
              Get All Companies
            </button>
            <div class="form-group">
              <label>Get Company by Name:</label>
              <input type="text" [(ngModel)]="companyName" 
                     placeholder="Enter company name" class="form-control">
              <button class="btn btn-secondary" (click)="getCompanyByName()">
                Get Company
              </button>
            </div>
            <div class="form-group">
              <label>Get Stock by Company:</label>
              <input type="text" [(ngModel)]="stockCompanyName" 
                     placeholder="Enter company name" class="form-control">
              <button class="btn btn-secondary" (click)="getStockByCompany()">
                Get Stock
              </button>
            </div>
          </div>
          <div *ngIf="companiesData.length > 0" class="results">
            <h4>Companies:</h4>
            <div *ngFor="let company of companiesData" class="result-item">
              <strong>{{company.name}}</strong> - {{company.activity}}
              <br>
              <small>Turnover: {{company.turnover}}M MAD | Employees: {{company.employesCount}} | Country: {{company.country}}</small>
            </div>
          </div>
          <div *ngIf="selectedCompany" class="results">
            <h4>Selected Company:</h4>
            <div class="result-item">
              <strong>{{selectedCompany.name}}</strong> - {{selectedCompany.activity}}
              <br>
              <small>Turnover: {{selectedCompany.turnover}}M MAD | Employees: {{selectedCompany.employesCount}} | Country: {{selectedCompany.country}}</small>
            </div>
          </div>
          <div *ngIf="stockData" class="results">
            <h4>Stock Information:</h4>
            <div class="result-item">
              <strong>{{stockData.companyName}}</strong>
              <br>
              <small>Price: {{stockData.stock | currency:'MAD':'symbol':'1.2-2'}} | Date: {{stockData.date | date:'short'}}</small>
            </div>
          </div>
        </div>

        <!-- Python MCP Server Tools -->
        <div class="tool-card">
          <h3>👥 Employee Tools (Python MCP Server)</h3>
          <div class="tool-actions">
            <div class="form-group">
              <label>Get Employee Information:</label>
              <input type="text" [(ngModel)]="employeeName" 
                     placeholder="Enter employee name" class="form-control">
              <button class="btn btn-secondary" (click)="getEmployeeInfo()">
                Get Employee
              </button>
            </div>
          </div>
          <div *ngIf="employeeData" class="results">
            <h4>Employee Information:</h4>
            <div class="result-item">
              <pre>{{employeeData.name}} - Salary: {{employeeData.salary}}</pre>
            </div>
          </div>
        </div>

        <!-- Filesystem Tools -->
        <div class="tool-card">
          <h3>📁 Filesystem Tools (Node.js MCP Server)</h3>
          <div class="tool-actions">
            <div class="form-group">
              <label>List Files:</label>
              <input type="text" [(ngModel)]="directoryPath" 
                     placeholder="Enter directory path" class="form-control">
              <button class="btn btn-secondary" (click)="listFiles()">
                List Files
              </button>
            </div>
            <div class="form-group">
              <label>Read File:</label>
              <input type="text" [(ngModel)]="filePath" 
                     placeholder="Enter file path" class="form-control">
              <button class="btn btn-secondary" (click)="readFile()">
                Read File
              </button>
            </div>
          </div>
          <div *ngIf="filesData.length > 0" class="results">
            <h4>Files:</h4>
            <div *ngFor="let file of filesData" class="result-item">
              <code>{{file}}</code>
            </div>
          </div>
          <div *ngIf="fileContent" class="results">
            <h4>File Content:</h4>
            <pre class="file-content">{{fileContent}}</pre>
          </div>
        </div>

        <!-- Test Direct Chat Integration -->
        <div class="tool-card">
          <h3>🤖 Test AI Integration</h3>
          <div class="tool-actions">
            <div class="form-group">
              <label>Quick Test Queries:</label>
              <button class="btn btn-primary" (click)="testQuery('Get all companies')">
                Test: Get All Companies
              </button>
              <button class="btn btn-primary" (click)="testQuery('Get information about employee John Doe')">
                Test: Employee Info
              </button>
              <button class="btn btn-primary" (click)="testQuery('List files in the current directory')">
                Test: List Files
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Processing request...</p>
      </div>
    </div>
  `,
  styles: [`
    .tools-container {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }

    .tools-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .tools-header h2 {
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .tools-subtitle {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .tool-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e1e8ed;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .tool-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .tool-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 1.25rem;
    }

    .tool-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: #374151;
      font-size: 0.9rem;
    }

    .form-group input {
      margin-bottom: 8px;
    }

    .results {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e1e8ed;
    }

    .results h4 {
      margin: 0 0 12px 0;
      color: #2c3e50;
      font-size: 1rem;
    }

    .result-item {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      border-left: 4px solid #667eea;
    }

    .result-item strong {
      color: #2c3e50;
    }

    .result-item small {
      color: #7f8c8d;
    }

    .file-content {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e1e8ed;
      max-height: 200px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .loading-overlay p {
      margin-top: 16px;
      color: #7f8c8d;
      font-weight: 500;
    }

    .btn {
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .tools-grid {
        grid-template-columns: 1fr;
      }
      
      .tool-card {
        padding: 16px;
      }
    }
  `]
})
export class ToolsComponent implements OnInit {
  // Form inputs
  companyName: string = '';
  stockCompanyName: string = '';
  employeeName: string = '';
  directoryPath: string = '';
  filePath: string = '';

  // Data storage
  companiesData: Company[] = [];
  selectedCompany: Company | null = null;
  stockData: Stock | null = null;
  employeeData: Employee | null = null;
  filesData: string[] = [];
  fileContent: string = '';

  // Loading state
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Set default values
    this.directoryPath = 'D:\\Files\\java\\java_pr\\mcp-tp';
    this.filePath = 'D:\\Files\\java\\java_pr\\mcp-tp\\README.md';
  }

  getAllCompanies(): void {
    this.isLoading = true;
    this.apiService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companiesData = companies;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching companies:', error);
        this.isLoading = false;
        // Fallback mock data for demo
        this.companiesData = [
          {
            name: 'Maroc Telecom',
            activity: 'Telecom',
            turnover: 3.6,
            employesCount: 10600,
            country: 'Maroc'
          },
          {
            name: 'OCP',
            activity: 'Extraction minière',
            turnover: 5.6,
            employesCount: 20600,
            country: 'Maroc'
          }
        ];
      }
    });
  }

  getCompanyByName(): void {
    if (!this.companyName.trim()) return;

    this.isLoading = true;
    this.apiService.getCompanyByName(this.companyName).subscribe({
      next: (company) => {
        this.selectedCompany = company;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching company:', error);
        this.isLoading = false;
        // Fallback for demo
        if (this.companyName.toLowerCase().includes('maroc')) {
          this.selectedCompany = {
            name: 'Maroc Telecom',
            activity: 'Telecom',
            turnover: 3.6,
            employesCount: 10600,
            country: 'Maroc'
          };
        }
      }
    });
  }

  getStockByCompany(): void {
    if (!this.stockCompanyName.trim()) return;

    this.isLoading = true;
    this.apiService.getStockByCompanyName(this.stockCompanyName).subscribe({
      next: (stock) => {
        this.stockData = stock;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching stock:', error);
        this.isLoading = false;
        // Fallback for demo
        this.stockData = {
          companyName: this.stockCompanyName,
          date: new Date().toISOString(),
          stock: 300 + Math.random() * 300
        };
      }
    });
  }

  getEmployeeInfo(): void {
    if (!this.employeeName.trim()) return;

    this.isLoading = true;
    this.apiService.getEmployeeInfo(this.employeeName).subscribe({
      next: (employee) => {
        this.employeeData = employee;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
        this.isLoading = false;
        // Fallback for demo
        this.employeeData = {
          name: this.employeeName,
          salary: '50,000 MAD'
        };
      }
    });
  }

  listFiles(): void {
    if (!this.directoryPath.trim()) return;

    this.isLoading = true;
    this.apiService.listFiles(this.directoryPath).subscribe({
      next: (files) => {
        this.filesData = files;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error listing files:', error);
        this.isLoading = false;
        // Fallback for demo
        this.filesData = [
          'mcp-client/',
          'mcp-server/',
          'mcp-frontend/',
          'python-mcp-server/',
          'README.md',
          'pom.xml'
        ];
      }
    });
  }

  readFile(): void {
    if (!this.filePath.trim()) return;

    this.isLoading = true;
    this.apiService.readFile(this.filePath).subscribe({
      next: (content) => {
        this.fileContent = content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error reading file:', error);
        this.isLoading = false;
        // Fallback for demo
        this.fileContent = 'File content not available - this is a demo fallback';
      }
    });
  }

  testQuery(query: string): void {
    // This will redirect to chat with a pre-filled query
    // For now, we'll just show the query could be sent
    this.isLoading = true;
    this.apiService.sendChatMessage(query).subscribe({
      next: (response) => {
        console.log('Test query response:', response);
        this.isLoading = false;
        // You could display the response here or redirect to chat
      },
      error: (error) => {
        console.error('Error sending test query:', error);
        this.isLoading = false;
      }
    });
  }
}

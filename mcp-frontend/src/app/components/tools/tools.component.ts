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
    <div class="tools-container fade-in">
      <div class="tools-header card">
        <div class="card-header">
          <h2 class="card-title">Available Tools</h2>
          <p class="card-subtitle">Test and explore MCP tools directly</p>
        </div>
      </div>

      <div class="tools-grid">
        <!-- Java MCP Server Tools -->
        <div class="tool-card card">
          <div class="card-header">
            <div class="tool-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19C9 20.1046 9.89543 21 11 21H20C21.1046 21 22 20.1046 22 19V15C22 13.8954 21.1046 13 20 13H11C9.89543 13 9 13.8954 9 15V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 19C2 20.1046 2.89543 21 4 21H8C8 20.1046 8 19 8 19V15C8 13.8954 8 13 8 13H4C2.89543 13 2 13.8954 2 15V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 5C9 6.10457 9.89543 7 11 7H20C21.1046 7 22 6.10457 22 5V1C22 -0.104569 21.1046 -1 20 -1H11C9.89543 -1 9 -0.104569 9 1V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 class="card-title">Company Tools</h3>
              <p class="card-subtitle">Java MCP Server</p>
            </div>
          </div>
          <div class="tool-actions">
            <button class="btn btn-primary" (click)="getAllCompanies()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 7H21L20 21H4L3 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Get All Companies
            </button>
            <div class="form-group">
              <label class="form-label">Get Company by Name:</label>
              <div class="input-group">
                <input type="text" [(ngModel)]="companyName" 
                       placeholder="Enter company name" class="form-input">
                <button class="btn btn-secondary" (click)="getCompanyByName()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Search
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Get Stock by Company:</label>
              <div class="input-group">
                <input type="text" [(ngModel)]="stockCompanyName" 
                       placeholder="Enter company name" class="form-input">
                <button class="btn btn-secondary" (click)="getStockByCompany()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Get Stock
                </button>
              </div>
            </div>
          </div>
          <div *ngIf="companiesData.length > 0" class="results">
            <h4 class="results-title">Companies</h4>
            <div *ngFor="let company of companiesData" class="result-item slide-up">
              <div class="result-header">
                <strong>{{company.name}}</strong>
                <span class="result-badge">{{company.activity}}</span>
              </div>
              <div class="result-details">
                <span class="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Turnover: {{company.turnover}}M MAD
                </span>
                <span class="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Employees: {{company.employesCount}}
                </span>
                <span class="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 21.7C17.3 17 20 13 20 10C20 5.6 16.4 2 12 2S4 5.6 4 10C4 13 6.7 17 12 21.7Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{company.country}}
                </span>
              </div>
            </div>
          </div>
          <div *ngIf="selectedCompany" class="results">
            <h4 class="results-title">Selected Company</h4>
            <div class="result-item slide-up">
              <div class="result-header">
                <strong>{{selectedCompany.name}}</strong>
                <span class="result-badge">{{selectedCompany.activity}}</span>
              </div>
              <div class="result-details">
                <span class="detail-item">Turnover: {{selectedCompany.turnover}}M MAD</span>
                <span class="detail-item">Employees: {{selectedCompany.employesCount}}</span>
                <span class="detail-item">{{selectedCompany.country}}</span>
              </div>
            </div>
          </div>
          <div *ngIf="stockData" class="results">
            <h4 class="results-title">Stock Information</h4>
            <div class="result-item slide-up">
              <div class="result-header">
                <strong>{{stockData.companyName}}</strong>
                <span class="result-badge success">{{stockData.stock | currency:'MAD':'symbol':'1.2-2'}}</span>
              </div>
              <div class="result-details">
                <span class="detail-item">Date: {{stockData.date | date:'short'}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Python MCP Server Tools -->
        <div class="tool-card card">
          <div class="card-header">
            <div class="tool-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 8V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4C17.4696 4 16.9609 4.21071 16.5858 4.58579C16.2107 4.96086 16 5.46957 16 6V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 8C20.5304 8 21.0391 8.21071 21.4142 8.58579C21.7893 8.96086 22 9.46957 22 10V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H16C15.4696 18 14.9609 17.7893 14.5858 17.4142C14.2107 17.0391 14 16.5304 14 16V10C14 9.46957 14.2107 8.96086 14.5858 8.58579C14.9609 8.21071 15.4696 8 16 8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 class="card-title">Employee Tools</h3>
              <p class="card-subtitle">Python MCP Server</p>
            </div>
          </div>
          <div class="tool-actions">
            <div class="form-group">
              <label class="form-label">Get Employee Information:</label>
              <div class="input-group">
                <input type="text" [(ngModel)]="employeeName" 
                       placeholder="Enter employee name" class="form-input">
                <button class="btn btn-secondary" (click)="getEmployeeInfo()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Get Employee
                </button>
              </div>
            </div>
          </div>
          <div *ngIf="employeeData" class="results">
            <h4 class="results-title">Employee Information</h4>
            <div class="result-item slide-up">
              <div class="result-header">
                <strong>{{employeeData.name}}</strong>
                <span class="result-badge success">{{employeeData.salary | currency}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filesystem Tools -->
        <div class="tool-card card">
          <div class="card-header">
            <div class="tool-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 class="card-title">Filesystem Tools</h3>
              <p class="card-subtitle">Node.js MCP Server</p>
            </div>
          </div>
          <div class="tool-actions">
            <div class="form-group">
              <label class="form-label">List Files:</label>
              <div class="input-group">
                <input type="text" [(ngModel)]="directoryPath" 
                       placeholder="Enter directory path" class="form-input">
                <button class="btn btn-secondary" (click)="listFiles()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  List Files
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Read File:</label>
              <div class="input-group">
                <input type="text" [(ngModel)]="filePath" 
                       placeholder="Enter file path" class="form-input">
                <button class="btn btn-secondary" (click)="readFile()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Read File
                </button>
              </div>
            </div>
          </div>
          <div *ngIf="filesData.length > 0" class="results">
            <h4 class="results-title">Files</h4>
            <div *ngFor="let file of filesData" class="result-item slide-up">
              <div class="file-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <code>{{file}}</code>
              </div>
            </div>
          </div>
          <div *ngIf="fileContent" class="results">
            <h4 class="results-title">File Content</h4>
            <div class="result-item slide-up">
              <pre class="file-content">{{fileContent}}</pre>
            </div>
          </div>
        </div>

        <!-- Test Direct Chat Integration -->
        <div class="tool-card card">
          <div class="card-header">
            <div class="tool-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="11" r="1" fill="currentColor"/>
                <circle cx="8" cy="11" r="1" fill="currentColor"/>
                <circle cx="16" cy="11" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 class="card-title">Test AI Integration</h3>
              <p class="card-subtitle">Quick test queries</p>
            </div>
          </div>
          <div class="tool-actions">
            <div class="quick-tests">
              <button class="btn btn-primary" (click)="testQuery('Get all companies')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 7H21L20 21H4L3 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Test: Get All Companies
              </button>
              <button class="btn btn-primary" (click)="testQuery('Get information about employee John Doe')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Test: Employee Info
              </button>
              <button class="btn btn-primary" (click)="testQuery('List files in the current directory')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
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
      padding: var(--space-6);
    }

    .tools-header {
      margin-bottom: var(--space-8);
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--space-6);
    }

    .tool-card {
      background: var(--bg-primary);
      border-radius: var(--border-radius-lg);
      border: 1px solid var(--border-color);
      transition: var(--transition-all);
      overflow: hidden;
    }

    .tool-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-color);
    }

    .tool-icon {
      width: 48px;
      height: 48px;
      background: var(--accent-blue);
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .tool-actions {
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-label {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.9rem;
    }

    .input-group {
      display: flex;
      gap: var(--space-2);
    }

    .form-input {
      flex: 1;
    }

    .quick-tests {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .results {
      padding: var(--space-6);
      border-top: 1px solid var(--border-color);
      background: var(--bg-secondary);
    }

    .results-title {
      margin: 0 0 var(--space-4) 0;
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .results-title::before {
      content: '';
      width: 4px;
      height: 16px;
      background: var(--primary-500);
      border-radius: 2px;
    }

    .result-item {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-md);
      padding: var(--space-4);
      margin-bottom: var(--space-3);
      transition: var(--transition-all);
    }

    .result-item:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .result-header strong {
      color: var(--text-primary);
      font-weight: 600;
    }

    .result-badge {
      background: var(--secondary-100);
      color: var(--secondary-700);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--border-radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .result-badge.success {
      background: var(--success-light);
      color: var(--success-dark);
    }

    .result-details {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .detail-item svg {
      color: var(--primary-500);
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-secondary);
    }

    .file-item svg {
      color: var(--primary-500);
      flex-shrink: 0;
    }

    .file-item code {
      background: var(--secondary-100);
      color: var(--text-primary);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--border-radius-sm);
      font-family: var(--font-mono);
      font-size: 0.875rem;
    }

    .file-content {
      background: var(--secondary-100);
      color: var(--text-primary);
      padding: var(--space-4);
      border-radius: var(--border-radius-md);
      border: 1px solid var(--border-color);
      max-height: 300px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: 0.875rem;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-overlay);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      color: white;
    }

    .loading-overlay p {
      margin-top: var(--space-4);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .tools-container {
        padding: var(--space-4);
      }

      .tools-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }

      .card-header {
        padding: var(--space-4);
      }

      .tool-actions {
        padding: var(--space-4);
      }

      .results {
        padding: var(--space-4);
      }

      .input-group {
        flex-direction: column;
      }

      .result-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }

      .result-details {
        flex-direction: column;
        gap: var(--space-2);
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

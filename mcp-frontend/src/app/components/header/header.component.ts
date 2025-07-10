import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>🤖 MCP Assistant</h1>
            <span class="subtitle">AI-Powered Multi-Tool Platform</span>
          </div>
          <nav class="nav">
            <a routerLink="/chat" routerLinkActive="active" class="nav-link">
              💬 Chat
            </a>
            <a routerLink="/tools" routerLinkActive="active" class="nav-link">
              🔧 Tools
            </a>
            <a routerLink="/history" routerLinkActive="active" class="nav-link">
              📝 History
            </a>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #2c3e50;
      font-weight: 700;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 0.875rem;
      display: block;
      margin-top: 2px;
    }

    .nav {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: #495057;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }

    .nav-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .nav-link.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav {
        gap: 1rem;
      }
      
      .nav-link {
        padding: 0.4rem 0.8rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class HeaderComponent {}

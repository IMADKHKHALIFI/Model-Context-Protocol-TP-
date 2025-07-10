import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { 
    path: 'chat', 
    loadComponent: () => import('./components/chat/chat.component').then(c => c.ChatComponent)
  },
  { 
    path: 'tools', 
    loadComponent: () => import('./components/tools/tools.component').then(c => c.ToolsComponent)
  },
  { 
    path: 'history', 
    loadComponent: () => import('./components/history/history.component').then(c => c.HistoryComponent)
  },
  { path: '**', redirectTo: '/chat' }
];

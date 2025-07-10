import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, ConnectionStatusComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'MCP Frontend - AI Assistant';
}

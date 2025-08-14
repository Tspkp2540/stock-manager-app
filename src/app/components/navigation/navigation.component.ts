import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  @Input() currentView: string = '';
  @Output() viewChange = new EventEmitter<string>();

  constructor(private readonly authService: AuthService) {}

  navigateTo(view: string): void {
    this.viewChange.emit(view);
  }

  canAddStock(): boolean {
    return this.authService.canAddStock();
  }
}

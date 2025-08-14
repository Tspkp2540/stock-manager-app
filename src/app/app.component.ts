import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { LogoutComponent } from './components/logout/logout.component';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Stock Manager';
  currentView = 'login';
  isLoggedIn = false;
  remainingTime = '';
  currentUser: any = null;
  
  private authSubscription?: Subscription;
  private timerInterval: any = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to login status changes
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
        this.currentView = loggedIn ? 'stock-list' : 'login';
        
        // อัปเดต currentUser
        this.currentUser = loggedIn ? this.authService.getCurrentUser() : null;
        
        if (loggedIn) {
          this.startTimer();
        } else {
          this.stopTimer();
        }
        
        console.log('Auth status changed:', loggedIn, 'View:', this.currentView);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.stopTimer();
  }

  onLoginSuccess(): void {
    // This will be handled by the AuthService subscription
    console.log('Login success detected');
  }

  logout(): void {
    this.authService.logout();
  }

  showView(view: string): void {
    if (this.isLoggedIn || view === 'login') {
      this.currentView = view;
      console.log('Switching to view:', view);
    }
  }

  extendSession(): void {
    this.authService.extendSession();
  }

  getRemainingTime(): string {
    const remaining = this.authService.getRemainingTime();
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private startTimer(): void {
    this.updateRemainingTime();
    this.timerInterval = setInterval(() => {
      this.updateRemainingTime();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateRemainingTime(): void {
    this.remainingTime = this.getRemainingTime();
  }

  canAddStock(): boolean {
    return this.authService.canAddStock();
  }
}
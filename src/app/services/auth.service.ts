import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id?: string;
  username: string;
  role: string;
  loginTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'currentUser';
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 นาที
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  private sessionTimer: any = null;

  constructor() {
    this.checkSessionOnInit();
  }

  login(user: any): void {
    const userSession = {
      ...user,
      loginTime: Date.now()
    };
    
    // Debug log
    console.log('🔑 LOGIN DEBUG:', {
      originalUser: user,
      sessionToStore: userSession,
      userRole: userSession.role,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(userSession));
    this.isLoggedInSubject.next(true);
    this.startSessionTimer();
    
    console.log('User logged in, session started');
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.isLoggedInSubject.next(false);
    this.clearSessionTimer();
    
    console.log('User logged out, session cleared');
  }

  isLoggedIn(): boolean {
    return this.hasValidSession();
  }

  getCurrentUser(): User | null {
    if (!this.hasValidSession()) {
      return null;
    }
    
    const userStr = localStorage.getItem(this.SESSION_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      this.logout();
      return null;
    }
  }

  getRemainingTime(): number {
    const user = this.getCurrentUser();
    if (!user) return 0;
    
    const elapsed = Date.now() - user.loginTime;
    const remaining = this.SESSION_DURATION - elapsed;
    
    return Math.max(0, remaining);
  }

  // เพิ่มฟังก์ชันสำหรับตรวจสอบสิทธิ์
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isUser(): boolean {
    return this.hasRole('user');
  }

  canAddStock(): boolean {
    return this.isAdmin();
  }

  canDeleteStock(): boolean {
    return this.isAdmin();
  }

  canViewStock(): boolean {
    return true; // ทุกคนสามารถดูได้
  }

  // Debug methods
  debugCurrentSession(): void {
    const user = this.getCurrentUser();
    console.log('🔍 DEBUG SESSION:', {
      hasSession: Boolean(user),
      user: user,
      isLoggedIn: this.isLoggedIn(),
      isAdmin: this.isAdmin(),
      canAddStock: this.canAddStock(),
      canDeleteStock: this.canDeleteStock(),
      remainingTime: this.getRemainingTime(),
      rawSession: localStorage.getItem(this.SESSION_KEY)
    });
  }

  clearAllSessions(): void {
    localStorage.clear();
    this.logout();
    console.log('🧹 All sessions cleared');
  }

  extendSession(): void {
    const user = this.getCurrentUser();
    if (user) {
      user.loginTime = Date.now();
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      this.restartSessionTimer();
      console.log('Session extended');
    }
  }

  private hasValidSession(): boolean {
    const userStr = localStorage.getItem(this.SESSION_KEY);
    if (!userStr) return false;
    
    try {
      const user: User = JSON.parse(userStr);
      const elapsed = Date.now() - user.loginTime;
      
      if (elapsed > this.SESSION_DURATION) {
        this.logout();
        return false;
      }
      
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  private checkSessionOnInit(): void {
    if (this.hasValidSession()) {
      this.startSessionTimer();
    }
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    const remaining = this.getRemainingTime();
    
    if (remaining > 0) {
      this.sessionTimer = setTimeout(() => {
        console.log('Session expired');
        this.logout();
      }, remaining);
    }
  }

  private restartSessionTimer(): void {
    this.clearSessionTimer();
    this.startSessionTimer();
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }
}

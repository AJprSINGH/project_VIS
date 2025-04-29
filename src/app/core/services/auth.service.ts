import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'star_protect_user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public isLoading = signal(false);
  
  // Default admin user for demo
  private readonly adminUser: User = {
    id: 'admin-001',
    name: 'System Admin',
    email: 'admin',
    role: 'admin'
  };
  
  // Mock underwriter users for demo
  private underwriters: { [key: string]: { user: string; password: string } } = {
    'UW001': { user: 'underwriter1', password: 'Pass@123' }
  };

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }
  
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  login(username: string, password: string): Observable<User> {
    this.isLoading.set(true);
    
    // Demo implementation for prototype
    // In a real app, this would be an API call
    
    // Simulate network delay
    return new Observable<User>(observer => {
      setTimeout(() => {
        this.isLoading.set(false);
        
        // Check if admin
        if (username === 'admin' && password === 'admin') {
          this.setCurrentUser(this.adminUser);
          observer.next(this.adminUser);
          observer.complete();
          return;
        }
        
        // Check if underwriter
        for (const [id, credentials] of Object.entries(this.underwriters)) {
          if (username === credentials.user && password === credentials.password) {
            const user: User = {
              id,
              name: `Underwriter ${id}`,
              email: credentials.user,
              role: 'underwriter'
            };
            this.setCurrentUser(user);
            observer.next(user);
            observer.complete();
            return;
          }
        }
        
        // Invalid credentials
        observer.error('Invalid username or password');
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === 'admin';
  }

  isUnderwriter(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === 'underwriter';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  // For admin to add new underwriters (demo implementation)
  addUnderwriter(id: string, password: string): void {
    this.underwriters[id] = { user: `underwriter${id}`, password };
  }
  
  // For admin to update underwriter password (demo implementation)
  updateUnderwriterPassword(id: string, newPassword: string): boolean {
    if (this.underwriters[id]) {
      this.underwriters[id].password = newPassword;
      return true;
    }
    return false;
  }
}
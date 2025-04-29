import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VehicleInsurance } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private policies: VehicleInsurance[] = [];
  private nextId = 1;
  
  public isLoading = signal(false);
  
  constructor(private authService: AuthService) {}
  
  getAllPolicies(): Observable<VehicleInsurance[]> {
    this.isLoading.set(true);
    
    const user = this.authService.getCurrentUser();
    let filteredPolicies = [...this.policies];
    
    // If underwriter, only show their policies
    if (user && user.role === 'underwriter') {
      filteredPolicies = filteredPolicies.filter(p => p.underwriterId === user.id);
    }
    
    // Simulate API call
    return of(filteredPolicies).pipe(
      delay(800),
      () => {
        this.isLoading.set(false);
        return of(filteredPolicies);
      }
    );
  }
  
  getPolicyById(id: string): Observable<VehicleInsurance | undefined> {
    this.isLoading.set(true);
    
    const policy = this.policies.find(p => p.id === id);
    
    if (!policy) {
      this.isLoading.set(false);
      return throwError(() => new Error('Policy not found'));
    }
    
    const user = this.authService.getCurrentUser();
    
    // If underwriter, check if they own the policy
    if (user && user.role === 'underwriter' && policy.underwriterId !== user.id) {
      this.isLoading.set(false);
      return throwError(() => new Error('Unauthorized access to policy'));
    }
    
    // Simulate API call
    return of({ ...policy }).pipe(
      delay(500),
      () => {
        this.isLoading.set(false);
        return of({ ...policy });
      }
    );
  }
  
  createPolicy(policy: Omit<VehicleInsurance, 'id' | 'createdAt'>): Observable<VehicleInsurance> {
    this.isLoading.set(true);
    
    const id = `POL${String(this.nextId).padStart(5, '0')}`;
    this.nextId++;
    
    const newPolicy: VehicleInsurance = {
      ...policy,
      id,
      createdAt: new Date()
    };
    
    this.policies.push(newPolicy);
    
    // Simulate API call
    return of({ ...newPolicy }).pipe(
      delay(800),
      () => {
        this.isLoading.set(false);
        return of({ ...newPolicy });
      }
    );
  }
  
  updatePolicy(id: string, updates: Partial<VehicleInsurance>): Observable<VehicleInsurance> {
    this.isLoading.set(true);
    
    const index = this.policies.findIndex(p => p.id === id);
    
    if (index === -1) {
      this.isLoading.set(false);
      return throwError(() => new Error('Policy not found'));
    }
    
    const user = this.authService.getCurrentUser();
    
    // If underwriter, check if they own the policy
    if (user && user.role === 'underwriter' && this.policies[index].underwriterId !== user.id) {
      this.isLoading.set(false);
      return throwError(() => new Error('Unauthorized access to policy'));
    }
    
    const updatedPolicy = {
      ...this.policies[index],
      ...updates
    };
    
    this.policies[index] = updatedPolicy;
    
    // Simulate API call
    return of({ ...updatedPolicy }).pipe(
      delay(800),
      () => {
        this.isLoading.set(false);
        return of({ ...updatedPolicy });
      }
    );
  }
}
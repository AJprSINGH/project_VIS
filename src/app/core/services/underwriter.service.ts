import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Underwriter } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UnderwriterService {
  private underwriters: Underwriter[] = [];
  private nextId = 1;

  public isLoading = signal(false);

  constructor() {
    // Add a sample underwriter for demo
    this.underwriters.push({
      id: 'UW001',
      name: 'Ajit Singh',
      dob: '2002-08-02',
      joiningDate: '2025-04-10'
    });
    this.nextId = 2;
  }

  getAllUnderwriters(): Observable<Underwriter[]> {
    this.isLoading.set(true);
    // Simulate API call
    return of([...this.underwriters]).pipe(
      delay(800),
      () => {
        this.isLoading.set(false);
        return of([...this.underwriters]);
      }
    );
  }

  getUnderwriterById(id: string): Observable<Underwriter | undefined> {
    this.isLoading.set(true);
    const underwriter = this.underwriters.find(u => u.id === id);

    if (!underwriter) {
      this.isLoading.set(false);
      return throwError(() => new Error('Underwriter not found'));
    }

    // Simulate API call
    return of({ ...underwriter }).pipe(
      delay(500),
      () => {
        this.isLoading.set(false);
        return of({ ...underwriter });
      }
    );
  }

  createUnderwriter(underwriter: Omit<Underwriter, 'id'>): Observable<Underwriter> {
    this.isLoading.set(true);

    const id = `UW${String(this.nextId).padStart(3, '0')}`;
    this.nextId++;

    const newUnderwriter: Underwriter = {
      ...underwriter,
      id
    };

    this.underwriters.push(newUnderwriter);

    // Simulate API call
    return of({ ...newUnderwriter }).pipe(
      delay(800),
      () => {
        this.isLoading.set(false);
        return of({ ...newUnderwriter });
      }
    );
  }

  updateUnderwriter(id: string, updates: Partial<Underwriter>): Observable<Underwriter> {
    this.isLoading.set(true);

    const index = this.underwriters.findIndex(u => u.id === id);

    if (index === -1) {
      this.isLoading.set(false);
      return throwError(() => new Error('Underwriter not found'));
    }

    const updatedUnderwriter = {
      ...this.underwriters[index],
      ...updates
    };

    this.underwriters[index] = updatedUnderwriter;

    // Simulate API call
    return of({ ...updatedUnderwriter }).pipe(
      delay(800),
      () => {
        this.isLoading.set(false);
        return of({ ...updatedUnderwriter });
      }
    );
  }
}
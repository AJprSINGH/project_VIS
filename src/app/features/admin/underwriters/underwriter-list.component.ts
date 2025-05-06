import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UnderwriterService } from '../../../core/services/underwriter.service';
import { Underwriter } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-underwriter-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1>Underwriters</h1>
        <a routerLink="/admin/underwriters/new" class="btn btn-primary">Register New Underwriter</a>
      </div>
      
      <ng-container *ngIf="underwriters.length === 0 && !underwriterService.isLoading()">
        <div class="empty-state card">
          <h3>No Underwriters Found</h3>
          <p>There are no underwriters registered in the system yet.</p>
          <a routerLink="/admin/underwriters/new" class="btn btn-primary">Register First Underwriter</a>
        </div>
      </ng-container><ng-container *ngIf="true">
        <div class="card">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (underwriter of underwriters; track underwriter.id) {
                <tr>
                  <td>{{ underwriter.id }}</td>
                  <td>{{ underwriter.name }}</td>
                  <td>{{ underwriter.dob | date:'mediumDate' }}</td>
                  <td>{{ underwriter.joiningDate | date:'mediumDate' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/admin/underwriters', underwriter.id]" class="btn-link">View</a>
                    <a (click)="deleteUnderwriter(underwriter.id)" class="btn-link-1">Delete</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </ng-container>
      
      <ng-container *ngIf="underwriterService.isLoading()">
        <app-loading-spinner message="Loading underwriters..."></app-loading-spinner>
      </ng-container>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
      padding: var(--space-3);
      text-align: left;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .data-table th {
      font-weight: 600;
      color: var(--neutral-700);
      background-color: var(--neutral-50);
    }
    
    .data-table tr:last-child td {
      border-bottom: none;
    }
    
    .actions {
      display: flex;
      gap: var(--space-2);
    }
    
    .btn-link {
      color: var(--primary-600);
      text-decoration: none;
      font-weight: 500;
    }
    
    .btn-link:hover {
      cursor:pointer;
      text-decoration: underline;
    }

    .btn-link-1 {
      color: var(--primary-600);
      text-decoration: none;
      font-weight: 500;
      margin-left: var(--space-2);
    }
    
    .btn-link-1:hover {
      cursor:pointer;
      text-decoration: underline;
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-8) var(--space-4);
    }
    
    .empty-state h3 {
      margin-bottom: var(--space-2);
    }
    
    .empty-state p {
      margin-bottom: var(--space-6);
      color: var(--neutral-600);
    }
    
    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .data-table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class UnderwriterListComponent implements OnInit {
  underwriters: Underwriter[] = [];

  constructor(public underwriterService: UnderwriterService) { }

  ngOnInit(): void {
    this.loadUnderwriters();
  }

  loadUnderwriters(): void {
    this.underwriterService.getAllUnderwriters().subscribe(data => {
      this.underwriters = data;
    });
  }

  deleteUnderwriter(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this underwriter?');
    if (confirmDelete) {
      this.underwriterService.deleteUnderwriter(id).subscribe(() => {
        this.loadUnderwriters();
      });
    } else {
      return;
    }

  }
}
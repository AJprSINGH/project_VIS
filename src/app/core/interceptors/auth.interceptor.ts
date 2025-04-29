import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  const user = authService.getCurrentUser();
  
  if (user) {
    // In a real application, you'd add a JWT token or auth header
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${user.id}`
      }
    });
  }
  
  return next(req);
};
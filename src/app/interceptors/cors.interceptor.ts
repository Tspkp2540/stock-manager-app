import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Check if request is for Google Apps Script
    if (req.url.includes('script.google.com')) {
      // Remove problematic headers that might cause CORS preflight
      const corsRequest = req.clone({
        setHeaders: {
          'Accept': 'application/json, text/plain, */*'
          // Remove Content-Type to avoid CORS preflight for simple requests
        }
      });
      
      return next.handle(corsRequest);
    }
    
    return next.handle(req);
  }
}

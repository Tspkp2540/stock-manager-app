import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Item } from '../models/item.model';
import { environment } from '../../environments/environment';

interface ApiResponse {
  success: boolean;
  data: any;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly FALLBACK_KEY = 'stock-items-fallback';
  private readonly itemsSubject = new BehaviorSubject<Item[]>([]);
  private readonly apiUrl = environment.apiUrl;
  private isOnline = navigator.onLine;

  constructor(private readonly http: HttpClient) {
    this.setupOfflineDetection();
    this.loadItems();
  }

  private setupOfflineDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.loadItems(); // Reload from server when back online
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadItems(): void {
    if (this.isOnline && this.apiUrl && this.apiUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      this.loadFromServer();
    } else {
      this.loadFromFallback();
    }
  }

  private loadFromServer(): void {
    this.http.get<ApiResponse>(this.apiUrl + '?action=getItems')
      .pipe(
        map(response => {
          if (response.success) {
            const items = response.data.map((item: any) => ({
              id: item.id?.toString(),
              name: item.name,
              quantity: Number(item.quantity)
            }));
            this.saveFallback(items);
            return items;
          } else {
            throw new Error('Server returned error');
          }
        }),
        catchError(() => {
          console.warn('Failed to load from server, using fallback');
          return this.loadFromFallback();
        })
      )
      .subscribe(items => {
        this.itemsSubject.next(items);
      });
  }

  private loadFromFallback(): Observable<Item[]> {
    const stored = localStorage.getItem(this.FALLBACK_KEY);
    let items: Item[];
    
    if (stored) {
      items = JSON.parse(stored);
    } else {
      // Initial sample data
      items = [
        { id: '1', name: 'เมาส์', quantity: 25 },
        { id: '2', name: 'คีย์บอร์ด', quantity: 15 },
        { id: '3', name: 'หูฟัง', quantity: 30 }
      ];
      this.saveFallback(items);
    }
    
    this.itemsSubject.next(items);
    return of(items);
  }

  private saveFallback(items: Item[]): void {
    localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(items));
  }

  getItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  addItem(item: Item): Observable<any> {
    if (this.isOnline && this.apiUrl && this.apiUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      return this.addItemToServer(item);
    } else {
      return this.addItemToFallback(item);
    }
  }

  private addItemToServer(item: Item): Observable<any> {
    const body = {
      name: item.name,
      quantity: item.quantity,
      price: item.price || 0
    };

    return this.http.post<ApiResponse>(this.apiUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      params: { action: 'addItem' }
    }).pipe(
      tap(response => {
        if (response.success) {
          this.loadFromServer(); // Refresh data
        }
      }),
      catchError(error => {
        console.error('Failed to add to server, adding to fallback:', error);
        return this.addItemToFallback(item);
      })
    );
  }

  private addItemToFallback(item: Item): Observable<any> {
    const currentItems = this.itemsSubject.value;
    const maxId = Math.max(0, ...currentItems.map(i => parseInt(i.id || '0')));
    const newItem: Item = {
      ...item,
      id: (maxId + 1).toString()
    };
    
    const updatedItems = [...currentItems, newItem];
    this.saveFallback(updatedItems);
    this.itemsSubject.next(updatedItems);
    
    return of({ success: true, data: newItem });
  }

  deleteItem(id: string): Observable<any> {
    if (this.isOnline && this.apiUrl && this.apiUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      return this.deleteItemFromServer(id);
    } else {
      return this.deleteItemFromFallback(id);
    }
  }

  private deleteItemFromServer(id: string): Observable<any> {
    const body = { id };

    return this.http.post<ApiResponse>(this.apiUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      params: { action: 'deleteItem' }
    }).pipe(
      tap(response => {
        if (response.success) {
          this.loadFromServer(); // Refresh data
        }
      }),
      catchError(error => {
        console.error('Failed to delete from server, deleting from fallback:', error);
        return this.deleteItemFromFallback(id);
      })
    );
  }

  private deleteItemFromFallback(id: string): Observable<any> {
    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== id);
    this.saveFallback(updatedItems);
    this.itemsSubject.next(updatedItems);
    
    return of({ success: true });
  }

  updateItem(id: string, updates: Partial<Item>): Observable<any> {
    if (this.isOnline && this.apiUrl && this.apiUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      return this.updateItemOnServer(id, updates);
    } else {
      return this.updateItemInFallback(id, updates);
    }
  }

  private updateItemOnServer(id: string, updates: Partial<Item>): Observable<any> {
    const body = { id, ...updates };

    return this.http.post<ApiResponse>(this.apiUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      params: { action: 'updateItem' }
    }).pipe(
      tap(response => {
        if (response.success) {
          this.loadFromServer(); // Refresh data
        }
      }),
      catchError(error => {
        console.error('Failed to update on server, updating fallback:', error);
        return this.updateItemInFallback(id, updates);
      })
    );
  }

  private updateItemInFallback(id: string, updates: Partial<Item>): Observable<any> {
    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    this.saveFallback(updatedItems);
    this.itemsSubject.next(updatedItems);
    
    return of({ success: true });
  }

  // Method to force refresh from server
  refreshFromServer(): void {
    if (this.isOnline) {
      this.loadFromServer();
    }
  }

  // Check if currently using server or fallback
  isUsingServer(): boolean {
    return this.isOnline && !!this.apiUrl && this.apiUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL';
  }
}
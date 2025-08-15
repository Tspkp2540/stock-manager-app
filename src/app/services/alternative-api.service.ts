import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AlternativeApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly authApiUrl = environment.authApiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Alternative method using simple GET requests to avoid CORS preflight
   */
  getStockItems(): Observable<any> {
    // Use simple GET with query parameters to avoid CORS preflight
    return this.http.get(`${this.apiUrl}?action=getItems&timestamp=${Date.now()}`);
  }

  /**
   * Alternative login using GET method
   */
  login(username: string, password: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('action', 'login');
    params.append('username', username);
    params.append('password', password);
    params.append('timestamp', Date.now().toString());
    
    return this.http.get(`${this.authApiUrl}?${params.toString()}`);
  }

  /**
   * Alternative method using fetch with minimal headers
   */
  async fetchWithMinimalHeaders(url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'text/plain'  // Use text/plain to avoid preflight
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      // Try to parse as JSON
      try {
        return JSON.parse(text);
      } catch {
        return { rawResponse: text };
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  /**
   * Test CORS with different approaches
   */
  async testCorsApproaches(): Promise<any> {
    const testResults = {
      simpleGet: null,
      fetchMinimal: null,
      timestamp: new Date().toISOString()
    };

    try {
      // Test 1: Simple Angular HTTP GET
      console.log('Testing simple GET...');
      const getResult = await this.http.get(`${this.apiUrl}?action=test`).toPromise();
      testResults.simpleGet = { success: true, data: getResult };
    } catch (error) {
      testResults.simpleGet = { success: false, error: error };
    }

    try {
      // Test 2: Minimal fetch
      console.log('Testing minimal fetch...');
      const fetchResult = await this.fetchWithMinimalHeaders(`${this.apiUrl}?action=test`);
      testResults.fetchMinimal = { success: true, data: fetchResult };
    } catch (error) {
      testResults.fetchMinimal = { success: false, error: error };
    }

    return testResults;
  }
}

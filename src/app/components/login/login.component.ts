import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  
  username = '';
  password = '';
  loading = false;
  error: string | null = null;

  // Google Apps Script Web App URL for authentication
  private readonly authApiUrl = environment.authApiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  login() {
    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      this.showErrorAlert(this.error);
      return;
    }

    this.loading = true;
    this.error = null;
    
    // สร้าง URL parameters สำหรับ Google Apps Script GET request
    const params = new URLSearchParams();
    params.append('action', 'login');
    params.append('username', this.username.trim());
    params.append('password', this.password.trim());
    
    const apiUrl = `${this.authApiUrl}?${params.toString()}`;
    
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.loading = false;
        
        // Enhanced Debug log
        console.log('🔍 LOGIN RESPONSE FULL DEBUG:', {
          fullResponse: response,
          responseKeys: Object.keys(response || {}),
          responseData: response.data,
          responseUser: response.user,
          dataExists: !!response.data,
          userExists: !!response.user,
          dataUserExists: !!(response.data?.user),
          dataUserRole: response.data?.user?.role,
          userRole: response.user?.role,
          responseSuccess: response.success,
          username: this.username,
          // Check all possible role locations
          possibleRoles: {
            'response.data.user.role': response.data?.user?.role,
            'response.user.role': response.user?.role,
            'response.data.role': response.data?.role,
            'response.role': response.role
          }
        });
        
        // Log raw response for debugging
        console.log('🔍 RAW RESPONSE:', JSON.stringify(response, null, 2));
        
        if (response.success) {
          // Enhanced production debugging
          const isProduction = window.location.hostname.includes('netlify.app') || environment.production;
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          console.log('🌍 ENVIRONMENT DEBUG:', {
            hostname: window.location.hostname,
            origin: window.location.origin,
            isProduction: isProduction,
            isLocalhost: isLocalhost,
            environmentProduction: environment.production,
            username: this.username
          });

          // TEMPORARY FIX: Force admin role for admin user in both production AND localhost
          let userData;
          if (this.username === 'admin' && (isProduction || isLocalhost)) {
            console.log('🔧 TEMPORARY FIX: Forcing admin role for admin user (production OR localhost)');
            userData = {
              id: response.data?.user?.id || '1',
              username: 'admin',
              role: 'admin' // Force admin role in production AND localhost
            };
          } else {
            // Normal logic for other users or other environments
            userData = {
              id: response.data?.user?.id || response.user?.id,
              username: response.data?.user?.username || response.user?.username || this.username,
              role: response.data?.user?.role || response.user?.role || 'user' // default to user if no role
            };
          }
          
          console.log('🔑 FINAL USER DATA:', userData);
          
          this.authService.login(userData);
          
          this.showSuccessAlert('เข้าสู่ระบบสำเร็จ!');
          
          // ส่ง event ไปยัง parent component
          setTimeout(() => {
            this.loginSuccess.emit();
          }, 1500);
          
        } else {
          const errorMsg = response.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
          this.error = errorMsg;
          this.showErrorAlert(errorMsg);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error details:', err);
        
        // จัดการ error ตาม status code
        let errorMessage = '';
        if (err.status === 401) {
          errorMessage = 'ไม่ได้รับอนุญาตให้เข้าถึง กรุณาตรวจสอบการตั้งค่า Google Apps Script';
        } else if (err.status === 403) {
          errorMessage = 'ถูกปฏิเสธการเข้าถึง กรุณาตรวจสอบสิทธิ์การเข้าถึง';
        } else if (err.status === 0) {
          errorMessage = 'ปัญหาเรื่อง CORS หรือการเชื่อมต่อ กรุณาตรวจสอบ URL';
        } else {
          errorMessage = `เกิดข้อผิดพลาดในการเชื่อมต่อ (${err.status}): ${err.message || 'กรุณาลองใหม่อีกครั้ง'}`;
        }
        
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
      }
    });
  }

  // Methods สำหรับแสดง SweetAlert2
  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: 'สำเร็จ!',
      text: message,
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#10b981',
      timer: 2000,
      timerProgressBar: true,
      width: '50vw',
      padding: '2rem',
      showClass: {
        popup: 'animate__animated animate__zoomIn'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      },
      customClass: {
        popup: 'login-success-popup',
        title: 'login-popup-title',
        htmlContainer: 'login-popup-text',
        confirmButton: 'login-popup-button'
      }
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด!',
      text: message,
      icon: 'error',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#ef4444',
      width: '50vw',
      padding: '2rem',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      },
      customClass: {
        popup: 'login-error-popup',
        title: 'login-popup-title',
        htmlContainer: 'login-popup-text',
        confirmButton: 'login-popup-button'
      }
    });
  }
}
import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
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
  private readonly authApiUrl = 'https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec';

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
    
    // ส่งข้อมูลไป Google Apps Script
    const loginData = {
      username: this.username.trim(),
      password: this.password.trim()
    };
    
    // Google Apps Script ต้องการ action parameter ใน URL และข้อมูลใน body
    const apiUrl = `${this.authApiUrl}?action=login`;
    
    // เพิ่ม headers สำหรับ Google Apps Script
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    this.http.post(apiUrl, loginData, httpOptions).subscribe({
      next: (response: any) => {
        this.loading = false;
        
        // Debug log
        console.log('🔍 LOGIN RESPONSE DEBUG:', {
          fullResponse: response,
          responseData: response.data,
          responseUser: response.user,
          dataUserRole: response.data?.user?.role,
          userRole: response.user?.role,
          responseSuccess: response.success,
          username: this.username
        });
        
        if (response.success) {
          // บันทึกข้อมูลผู้ใช้ใน AuthService - ใช้ข้อมูลจาก API response เป็นหลัก
          const userData = {
            id: response.data?.user?.id || response.user?.id,
            username: response.data?.user?.username || response.user?.username || this.username,
            role: response.data?.user?.role || response.user?.role || 'user' // default to user if no role
          };
          
          console.log('🔑 STORING USER DATA:', userData);
          
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
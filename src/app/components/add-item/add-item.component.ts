import { Component } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { AuthService } from '../../services/auth.service';
import { Item } from '../../models/item.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  newItem: Item = { name: '', quantity: 0, price: 0 };
  isUsingServer = false;

  constructor(
    private readonly stockService: StockService,
    private readonly authService: AuthService
  ) {
    this.isUsingServer = this.stockService.isUsingServer();
  }

  addItem() {
    // Check permission first
    if (!this.canAddStock()) {
      Swal.fire({
        title: 'ไม่มีสิทธิเพิ่มสินค้า',
        text: 'เฉพาะ Admin เท่านั้นที่สามารถเพิ่มสินค้าได้',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#7D8E95',
        background: '#FBE0C3',
        color: '#344648'
      });
      return;
    }

    if (!this.newItem.name.trim() || this.newItem.quantity <= 0) {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกชื่อสินค้า จำนวน และราคาให้ถูกต้อง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#344648',
        background: '#FBE0C3',
        color: '#344648'
      });
      return;
    }

    this.stockService.addItem(this.newItem).subscribe({
      next: () => {
        Swal.fire({
          title: 'เพิ่มสินค้าสำเร็จ!',
          text: `เพิ่ม ${this.newItem.name} จำนวน ${this.newItem.quantity} แล้ว`,
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#7D8E95',
          background: '#FBE0C3',
          color: '#344648',
          timer: 2000,
          timerProgressBar: true
        });
        this.newItem = { name: '', quantity: 0, price: 0 };
      },
      error: (error) => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#344648',
          background: '#FBE0C3',
          color: '#344648'
        });
        console.error('Error adding item:', error);
      }
    });
  }

  canAddStock(): boolean {
    return this.authService.canAddStock();
  }

  getUserRole(): string {
    return this.authService.getCurrentUser()?.role || 'user';
  }
}
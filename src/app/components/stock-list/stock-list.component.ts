import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { AuthService } from '../../services/auth.service';
import { Item } from '../../models/item.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit, OnDestroy {
  title = 'รายการสินค้า';
  items: Item[] = [];
  filteredItems: Item[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  isUsingServer = false;
  
  private readonly subscription = new Subscription();

  constructor(
    private readonly stockService: StockService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.isUsingServer = this.stockService.isUsingServer();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadItems(): void {
    this.loading = true;
    this.error = null;
    
    const sub = this.stockService.getItems().subscribe({
      next: (items: Item[]) => {
        this.items = items;
        this.filteredItems = [...items];
        this.loading = false;
        console.log('Items loaded:', items.length);
      },
      error: (error: any) => {
        console.error('Error loading items:', error);
        this.error = 'ไม่สามารถโหลดข้อมูลได้';
        this.loading = false;
      }
    });
    
    this.subscription.add(sub);
  }

  filterItems(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  deleteItem(item: Item): void {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: `ต้องการลบ "${item.name}" หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#344648',
      cancelButtonColor: '#7D8E95',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      background: '#FBE0C3',
      color: '#344648'
    }).then((result) => {
      if (result.isConfirmed && item.id) {
        const sub = this.stockService.deleteItem(item.id).subscribe({
          next: () => {
            Swal.fire({
              title: 'ลบเรียบร้อย!',
              text: `ลบ "${item.name}" เรียบร้อยแล้ว`,
              icon: 'success',
              confirmButtonColor: '#7D8E95',
              background: '#FBE0C3',
              color: '#344648',
              timer: 1500,
              timerProgressBar: true
            });
          },
          error: (error: any) => {
            console.error('Error deleting item:', error);
            Swal.fire({
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบสินค้าได้',
              icon: 'error',
              confirmButtonColor: '#344648',
              background: '#FBE0C3',
              color: '#344648'
            });
          }
        });
        this.subscription.add(sub);
      }
    });
  }

  reloadData(): void {
    if (this.stockService.isUsingServer()) {
      this.stockService.refreshFromServer();
    }
    this.loadItems();
    this.isUsingServer = this.stockService.isUsingServer();
  }

  // ฟังก์ชันสำหรับตรวจสอบสิทธิ์
  canDeleteStock(): boolean {
    return this.authService.canDeleteStock();
  }

  canViewStock(): boolean {
    return this.authService.canViewStock();
  }

  getUserRole(): string {
    return this.authService.getCurrentUser()?.role || 'user';
  }

  getUserName(): string {
    return this.authService.getCurrentUser()?.username || 'Guest';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Debug method
  debugSession(): void {
    this.authService.debugCurrentSession();
  }

  clearSessions(): void {
    this.authService.clearAllSessions();
    location.reload();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterItems();
  }
}

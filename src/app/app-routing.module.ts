import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { AddItemComponent } from './components/add-item/add-item.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'stock-list', component: StockListComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: '**', redirectTo: '/login' } // wildcard route สำหรับ 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

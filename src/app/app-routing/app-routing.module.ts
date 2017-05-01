import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from '../index/index.component';
import { TextEditComponent } from '../text-edit/text-edit.component';


const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index',  component: IndexComponent },
  { path: 'edit', component: TextEditComponent },
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) 
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

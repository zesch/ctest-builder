import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';
import { StateManagementService } from './services/state-management.service';
import { CtestService } from './services/ctest.service';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalDialogComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    CtestService,
    StateManagementService],
  entryComponents: [ModalDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

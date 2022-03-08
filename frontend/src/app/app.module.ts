import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';

import { StateManagementService } from './services/state-management.service';
import { CtestService } from './services/ctest.service';
import { HttpClientModule } from '../../node_modules/@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [
    CtestService,
    StateManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }

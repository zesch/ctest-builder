import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { TextEditComponent } from './text-edit/text-edit.component';
import { TextService } from './text.service';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    AppComponent,
    TextEditComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [TextService],
  bootstrap: [AppComponent]
})
export class AppModule { }

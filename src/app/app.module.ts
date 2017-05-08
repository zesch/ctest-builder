import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdInputModule, MdSlideToggleModule} from '@angular/material';
import 'hammerjs';
import {DndModule} from 'ng2-dnd';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule, MdCheckboxModule, MdInputModule, MdSlideToggleModule,
    DndModule.forRoot(),
    FlexLayoutModule
  ],
  providers: [TextService],
  bootstrap: [AppComponent]
})
export class AppModule { }

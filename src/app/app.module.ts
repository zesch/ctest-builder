import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdDialogModule, MdSlideToggleModule, MdCardModule, MdTooltipModule, MdSnackBarModule } from '@angular/material';
import 'hammerjs';
import {DndModule} from 'ng2-dnd';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { TextEditComponent } from './text-edit/text-edit.component';
import { TextService } from './text.service';
import { IndexComponent } from './index/index.component';
import { SubmitTextService } from 'app/submit-text.service';
import { HighlightDirective } from './highlight.directive';
import { TextEditDialogComponent } from './text-edit-dialog/text-edit-dialog.component';
import { ReformatDialogComponent } from './reformat-dialog/reformat-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    TextEditComponent,
    IndexComponent,
    HighlightDirective,
    TextEditDialogComponent,
    ReformatDialogComponent,
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule, MdCheckboxModule, MdDialogModule,MdInputModule,MdSnackBarModule, MdSlideToggleModule, MdCardModule, MdTooltipModule,
    DndModule.forRoot(),
    FlexLayoutModule
  ],
  entryComponents: [
    TextEditDialogComponent,ReformatDialogComponent,
  ],
  providers: [TextService, SubmitTextService],
  bootstrap: [AppComponent]
})
export class AppModule { }

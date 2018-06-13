import { LanguageTranslateService } from './language-translate.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextEditComponent } from './text-edit/text-edit.component';
import { StorageService } from './storage.service';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { ReplacePipe } from './shared/pipes/replace.pipe';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TextEditComponent,
    ReplacePipe,
    ModalDialogComponent
  ],
  imports: [
     NgxDnDModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    LanguageTranslateService, StorageService],
  entryComponents: [ModalDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

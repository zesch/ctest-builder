import { LanguageTranslateService } from './language-translate.service';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';

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
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { CtestService } from './ctest.service';
import { TokenComponent } from './text-edit/token/token.component';
import { PromptPipe } from './shared/pipes/prompt.pipe';
import { SolutionsPipe } from './shared/pipes/solutions.pipe';
import { IosviewPipe } from './shared/pipes/iosview.pipe';
import { TestviewPipe } from './shared/pipes/testview.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TextEditComponent,
    ReplacePipe,
    ModalDialogComponent,
    TokenComponent,
    PromptPipe,
    SolutionsPipe,
    IosviewPipe,
    TestviewPipe
  ],
  imports: [
    NgxDnDModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    LanguageTranslateService, CtestService],
  entryComponents: [ModalDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

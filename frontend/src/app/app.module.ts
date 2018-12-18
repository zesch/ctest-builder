import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';

import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './modules/app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './modules/material.module';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextEditComponent } from './components/text-edit/text-edit.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { ReplacePipe } from './pipes/replace.pipe';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { CtestService } from './services/ctest.service';
import { TokenComponent } from './components/text-edit/token/token.component';
import { PromptPipe } from './pipes/prompt.pipe';
import { SolutionsPipe } from './pipes/solutions.pipe';
import { IosviewPipe } from './pipes/iosview.pipe';
import { TestviewPipe } from './pipes/testview.pipe';
import { SolutionPipe } from './pipes/solution.pipe';
import { ExportComponent } from './components/text-edit/export/export.component';
import { StateManagementService } from './services/state-management.service';
import { PlainSolutionsPipe } from './pipes/plain-solutions.pipe';
import { ColoredGapsPipe } from './pipes/colored-gaps.pipe';

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
    TestviewPipe,
    SolutionPipe,
    ExportComponent,
    PlainSolutionsPipe,
    ColoredGapsPipe
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
    CtestService,
    StateManagementService
  ],
  entryComponents: [ModalDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

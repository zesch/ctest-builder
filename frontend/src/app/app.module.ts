import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { TextEditComponent } from './components/text-edit/text-edit.component';
import { TokenComponent } from './components/text-edit/token/token.component';
import { HelpPageComponent } from './components/text-edit/help-page/help-page.component';
import { ExportComponent } from './components/text-edit/export/export.component';
import { ColoredGapsPipe } from './pipes/colored-gaps.pipe';
import { IosviewPipe } from './pipes/iosview.pipe';
import { JackViewPipe } from './pipes/jack-view.pipe';
import { PlainSolutionsPipe } from './pipes/plain-solutions.pipe';
import { PromptPipe } from './pipes/prompt.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import { SolutionPipe } from './pipes/solution.pipe';
import { SolutionsPipe } from './pipes/solutions.pipe';
import { TestviewPipe } from './pipes/testview.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalDialogComponent,
    TextEditComponent,
    TokenComponent,
    HelpPageComponent,
    ExportComponent,
    ColoredGapsPipe,
    IosviewPipe,
    JackViewPipe,
    PlainSolutionsPipe,
    PromptPipe,
    ReplacePipe,
    SolutionPipe,
    SolutionsPipe,
    TestviewPipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    CtestService,
    StateManagementService],
  entryComponents: [ModalDialogComponent, HelpPageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

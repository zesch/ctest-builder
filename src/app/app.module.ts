import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTabsModule, MatSelectModule, MatButtonModule, MatSliderModule, MatCheckboxModule, MatInputModule,
  MatDialogModule, MatSlideToggleModule, MatCardModule, MatTooltipModule, MatSnackBarModule, MATERIAL_COMPATIBILITY_MODE
} from '@angular/material';
import 'hammerjs';
import { DndModule } from 'ng2-dnd';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { TextEditComponent } from './text-edit/text-edit.component';
import { TextService } from './text.service';
import { IndexComponent } from './index/index.component';
import { SubmitTextService } from 'app/submit-text.service';
import { HighlightDirective } from './highlight.directive';
import { TextEditDialogComponent } from './text-edit-dialog/text-edit-dialog.component';
import { ReformatDialogComponent } from './reformat-dialog/reformat-dialog.component';
import { InMemDataService } from 'app/in-mem-data.service';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
// import {Ng2Webstorage} from "ngx-webstorage";


@NgModule({
  declarations: [
    AppComponent,
    TextEditComponent,
    IndexComponent,
    HighlightDirective,
    TextEditDialogComponent,
    ReformatDialogComponent,
    ExportDialogComponent,

  ],
  imports: [
    BrowserModule,
    // Ng2Webstorage,
    FormsModule,
    HttpModule,
    // InMemoryWebApiModule.forRoot(InMemDataService),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule, MatSelectModule, MatButtonModule, MatSliderModule, MatCheckboxModule, MatDialogModule, MatInputModule, MatSnackBarModule, MatSlideToggleModule, MatCardModule, MatTooltipModule,
    DndModule.forRoot(),
    FlexLayoutModule,
  ],
  entryComponents: [
    TextEditDialogComponent, ReformatDialogComponent, ExportDialogComponent,
  ],
  providers: [TextService, SubmitTextService, {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},],
  bootstrap: [AppComponent]
})
export class AppModule { }

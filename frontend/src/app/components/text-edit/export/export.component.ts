import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import { TestviewPipe } from '../../../pipes/testview.pipe';
import { Word } from '../../../models/word';
import { IosviewPipe } from '../../../pipes/iosview.pipe';
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from '../../../components/modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'tp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  @Input('words')
  public words: Word[];

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Cancel Changes and return back home
   */
  public openDialogCancel(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '',
      data: { title: 'Go Back', content: 'All data will be lost, do you want to continue', no: 'No', yes: 'Yes' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        // Yes Case
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Opens export dialogue.
   */
  public openDialogExport(): void {
    const data = {
      file: { placeholder: 'Name', title: '' },
      options: {
        title: 'Format',
        values: [
          'PDF',
          'Text'
        ],
        selectedValue: 'Text'
      },
      title: 'Export As', action: () => {
        switch (data.options.selectedValue) {
          case 'PDF':
            this.exportAsPDF(data.file.title);
            break;
          case 'Text':
            this.exportAsTXT(data.file.title);
            break;
        }
      }, no: 'Cancel', yes: 'Export'
    };
    this.dialog.open(ModalDialogComponent, { width: '', data });
  }


  /**
   * Exports the current c-test as PDF
   */
  private exportAsPDF(title: string) {
    const doc = new jsPDF();
    const view = new TestviewPipe();
    const text = this.words
        .map(view.transform)
        .join(' ');

    doc.fromHTML(text, 15, 15, { 'width': 180 });
    doc.save(title);
    return;
  }

  /**
   * Exports the current c-test as PDF
   */
  private exportAsTXT(filename: string) {
    const div = document.createElement('div');
    const view = new IosviewPipe();
    div.innerHTML = this.words.map(view.transform).join(' ');
    const doc = document.createElement('a');
    doc.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(div.innerText)),
      doc.setAttribute('download', (filename + '.txt'));
    doc.click();
  }
}

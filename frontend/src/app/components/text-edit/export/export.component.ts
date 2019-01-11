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
      title: 'Export As',
      file: {
        placeholder: 'Name',
        title: ''
      },
      fileTypes: {
        title: 'File Type',
        values: [
          'pdf',
          'txt'
        ],
        selectedValue: 'pdf'
      },
      formats: {
        title: 'Gap Format',
        values: [
          'edit -> ed{it}',
          'test -> te__'
        ],
        selectedValue: 'test -> te__'
      },
      action: () => {
        let formatFunc;
        let exportFunc;

        switch(data.formats.selectedValue) {
          case 'edit -> ed{it}':
            formatFunc = new IosviewPipe().transform;
            break;
          case 'test -> te__':
            formatFunc = new TestviewPipe().transform;
            break;
          default:
            formatFunc = new TestviewPipe().transform;
        }

        switch (data.fileTypes.selectedValue) {
          case 'pdf':
            exportFunc = this.exportAsPDF(data.file.title, formatFunc);
            break;
          case 'txt':
            exportFunc = this.exportAsTXT(data.file.title, formatFunc);
            break;
          default:
            exportFunc = this.exportAsTXT(data.file.title, formatFunc);
        }
        this.exportAsJSON(data.file.title);
      },
      no: 'Cancel',
      yes: 'Export'
    };
    this.dialog.open(ModalDialogComponent, { width: '', data });
  }


  /**
   * Exports the current c-test as PDF
   */
  public exportAsPDF(title: string, transform: (Word) => string) {
    const doc = new jsPDF();
    const text = this.words.map(transform).join(' ');

    doc.fromHTML(text, 15, 15, { 'width': 180 });
    doc.save(title);
    return;
  }

  /**
   * Exports the current c-test as TXT.
   */
  public exportAsTXT(filename: string, transform: (Word) => string) {
    const text = document.createElement('div');
    text.innerHTML = this.words.map(transform).join(' ');
    const download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text.innerText)),
      download.setAttribute('download', (filename + '.txt'));
    download.click();
  }


  /**
   * Exports the current c-test as re-importable json.
   */
  public exportAsJSON(filename: string) {
    const text = document.createElement('div');
    text.innerHTML = JSON.stringify({
      words: this.words,
      warnings: []
    });
    const download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text.innerText)),
      download.setAttribute('download', (filename + '.ctest.json'));
    download.click();
  }
}

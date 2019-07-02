import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import { TestviewPipe } from '../../../pipes/testview.pipe';
import { Word } from '../../../models/word';
import { IosviewPipe } from '../../../pipes/iosview.pipe';
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from '../../../components/modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';
import { JackViewPipe } from '../../../pipes/jack-view.pipe';

@Component({
  selector: 'tp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  @Input('words')
  public words: Word[];

  @Input()
  public title: string;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public toFileName(title: string) {
    if (!title) {
      return 'export';
    }
    return title.replace(/ /g, '_');
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
      formats: {
        title: 'Gap Format',
        values: [
          'JACK XML',
          'edit -> ed{it}',
          'test -> te__',
        ],
        selectedValue: 'JACK XML'
      },
      fileTypes: {
        title: 'File Type',
        values: [
          'pdf',
          'txt'
        ],
        selectedValue: 'pdf'
      },
      file: {
        placeholder: 'Name',
        title: this.title || ''
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
          default: {
            formatFunc = new JackViewPipe().transform;
            data.fileTypes.selectedValue = 'JACK XML';
          }
        }

        const fileName = data.file.title.replace(' ', '_');

        switch (data.fileTypes.selectedValue) {
          case 'pdf':
            exportFunc = this.exportAsPDF(fileName, formatFunc);
            break;
          case 'txt':
            exportFunc = this.exportAsTXT(fileName, formatFunc);
            break;
          default:
            exportFunc = this.exportAsJACK(fileName, formatFunc);
        }
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
    if (title === undefined) {
      title = 'export';
    }
    const doc = new jsPDF();
    const text = this.words.map(transform).join(' ');

    doc.fromHTML([title, text].join('\n'), 15, 15, { 'width': 180 });
    doc.save(title);
    return;
  }

  /**
   * Exports the current c-test as TXT.
   */
  public exportAsTXT(filename: string, transform: (Word) => string) {
    if (filename === undefined) {
      filename = 'export';
    }
    const text = document.createElement('div');
    text.innerHTML = this.words.map(transform).join(' ');
    const download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text.innerText)),
      download.setAttribute('download', (filename + '.txt'));
    download.click();
  }

  /**
   * Exports the current c-test as JACK XML.
   */
  public exportAsJACK(filename: string, transform: (Word) => string) {
    const preamble = '<?xml version="1.0" encoding="ISO-8859-1"?>\n\n<exercise type="fillIn">\n\n<input> </input>\n\n';
    const title = `<task> &lt;span style="font-size:120%">${filename.replace('.*', '')}&lt;/span>\n`
    const taskText = this.words.map(transform).join(' ');
    const taskPostfix = '\n\n\n&lt;span style= "color:#ff0000;">Denken Sie bitte daran, auf &lt;span style="font-weight:600;">\'Einreichen\'&lt;/span> zu klicken, bevor Sie zur n�chsten Aufgabe wechseln. Please don�t forget to click &lt;span style="font-weight:600;">\'submit\'&lt;/span> before you start the next task.&lt;/span> </task>\n\n<advice> </advice>\n\n<correctanswer>\n<option result="false"/>\n<message/>\n</correctanswer>\n\n<feedback>';
    const solutions = this.words
      .filter(token => token.gapStatus)
      .map((token, i) => `<option result="equals(trim('[pos=${i+1}]'),'${token.value.substring(token.offset)}')" points="5"/>`)
      .join('\n')
    const end = '</feedback>\n\n<output> </output>\n\n<skipmessage>Schade, dass Sie diesen Text �bersprungen haben.</skipmessage>\n\n</exercise>';
    const content = [preamble, title, taskText, taskPostfix, solutions, end].join('\n');
    const download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)),
      download.setAttribute('download', 'stage1.xml');
    download.click();
  }

  /**
   * Exports the current c-test as re-importable json.
   */
  public exportAsJSON(filename: string) {
    if (filename === undefined) {
      filename = 'export';
    }
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

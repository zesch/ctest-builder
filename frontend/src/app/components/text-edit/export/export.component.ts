import { Component, OnInit, Input } from '@angular/core';
import jsPDF from 'jspdf';
import { TestviewPipe } from '../../../pipes/testview.pipe';
import { Word } from '../../../models/word';
import { IosviewPipe } from '../../../pipes/iosview.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../components/modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';
import { JackViewPipe } from '../../../pipes/jack-view.pipe';

/**
 * Removes unnecessary spaces around punctuation.
 * Example: " ." => "."
 */
export function cleanSpaces(text: string): string {
  const noPrefix = /(\s)[\u2019\u201D,.;?!\]})>°*$%€£₽_\-'=/\\]/g; // symbols that should have no space in front.
  const noPostfix = /([\u2018\u201C\[{(<#@_\-'=/\\])\s/g;
  const indices = [
    ...allMatches(noPrefix, text).map(m => m.index),
    ...allMatches(noPostfix, text).map(m => m.index + 1)
  ];
  return removeCharsAt(text, indices);
}

function allMatches(re: RegExp, text: string) {
  const matches = [];
  let match: RegExpExecArray | null;
  do {
    match = re.exec(text);
    if (match) {
      matches.push(match);
    }
  }
  while (match);
  return matches;
}

/**
 * Returns the given string with characters at the given indices removed.
 * Out of bounds indices are silently ignored.
 */
function removeCharsAt(text: string, indices: number[]) {
  if (indices.length === 0) {
    console.warn(`No indices provided for replacement of text "${text}".`);
    return text;
  }

  const toDelete = Array.from(new Set(indices))
    .filter(v => v >= 0)
    .sort((a, b) => a - b)
    .reverse();

  let next = toDelete.pop();
  return Array.from(text)
    .filter((_, i) => {
      if (i === next) {
        next = toDelete.pop();
        return false;
      }
      return true;
    })
    .join('');
}

@Component({
  selector: 'app-export',
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

  ngOnInit() { }

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
      jackStage: {
        title: 'JACK Stage',
        value: 1
      },
      action: () => {
        let formatFunc;
        let exportFunc;

        switch (data.formats.selectedValue) {
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

        const fileName = data.file.title.replace(/ /g, '_');
        const stageNo = data.jackStage.value;

        switch (data.fileTypes.selectedValue) {
          case 'pdf':
            exportFunc = this.exportAsPDF(fileName, formatFunc);
            break;
          case 'txt':
            exportFunc = this.exportAsTXT(fileName, formatFunc);
            break;
          default:
            exportFunc = this.exportAsJACK(data.file.title, stageNo, formatFunc);
        }
      },
      no: 'Cancel',
      yes: 'Export'
    };
    this.dialog.open(ModalDialogComponent, { width: '', data });
  }


  /**
   * Exports the current c-test as PDF
   * needed to remove options that are not supported in newly doc.html
   */
  public exportAsPDF(fileName: string, transform: (Word: Word) => string) {
    if (fileName === undefined) {
      fileName = 'export';
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    const cleanText = cleanSpaces(this.words.map(transform).join(' '));
    const title = `<h2>${fileName.replace(/[_]/g, ' ')}</h2>`;
    const text = `<p style="text-align: justify">${cleanText}</p>`;
    doc.html([title, text].join('<br>'));
    doc.save(fileName);
    return;
  }

  /**
   * Exports the current c-test as TXT.
   */
  public exportAsTXT(fileName: string, transform: (Word: Word) => string) {
    if (fileName === undefined) {
      fileName = 'export';
    }
    const text = fileName.replace(/[_]/g, ' ') + '\r\n' + cleanSpaces(this.words.map(transform).join(' '));
    const blob: Blob = new Blob([new Buffer(text)], { type: 'text/plain; charset=utf-8'});
    const download = document.createElement('a');
    download.setAttribute('href', URL.createObjectURL(blob)),
    download.setAttribute('download', (fileName + '.txt'));
    download.click();
  }

  /**
   * Exports the current c-test as JACK XML.
   */
  public exportAsJACK(filename: string, stage: number | string, transform: (Word: Word) => string) {
    // generate xml content
    const preamble = '<?xml version="1.0" encoding="ISO-8859-1"?>\n\n<exercise type="fillIn">\n\n<input> </input>\n\n';
    const title = `<task> &lt;span style="font-size:120%">${filename.replace('.*', '')}&lt;/span>\n`
    const taskText = this.words
      .map(transform)
      .join(' ')
      .replace(/[\u2018-\u2019]/g, '\'') // not supported in ISO-8859-1
      .replace(/[\u201C-\u201D]/g, '"'); // not supported in ISO-8859-1

    const taskPostfix = '\n\n\n&lt;span style= "color:#ff0000;">Denken Sie bitte daran, auf &lt;span style="font-weight:600;">\'Einreichen\'&lt;/span> zu klicken, bevor Sie zur nächsten Aufgabe wechseln. Please don\'t forget to click &lt;span style="font-weight:600;">\'submit\'&lt;/span> before you start the next task.&lt;/span> </task>\n\n<advice> </advice>\n\n<correctanswer>\n<option result="false"/>\n<message/>\n</correctanswer>\n\n<feedback>';
    const solutions = this.words
      .filter(token => token.gapStatus)
      .map((token, i) => `<option result="equals(trim('[pos=${i + 1}]'),'${token.value.substring(token.offset)}')" points="5"/>`)
      .join('\n')
    const end = '</feedback>\n\n<output> </output>\n\n<skipmessage>Schade, dass Sie diesen Text übersprungen haben.</skipmessage>\n\n</exercise>';
    const content = [preamble, title, cleanSpaces(taskText), taskPostfix, solutions, end].join('\n');

    // provide as downloadable file
    const blob = new Blob([new Buffer(content, 'latin1')], { type: 'text/xml;charset=iso-8859-1' });
    const download = document.createElement('a');
    download.setAttribute('href', window.URL.createObjectURL(blob));
    download.setAttribute('download', `stage${stage}.xml`);
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

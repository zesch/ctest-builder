import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';
import { Word } from '../shared/models/word';
import { ReplacePipe } from '../shared/pipes/replace.pipe';
import * as jsPDF from 'jspdf';
import { CtestService } from '../ctest.service';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { map } from '../../../node_modules/rxjs/operators/map';

@Component({
  selector: 'tp-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.scss']
})

export class TextEditComponent implements OnInit {
  /** holds all words */
  public words = []; //TODO: replace with observables.

  /** holds single word mode that indicate edit or view mode */
  public isEditMode = false;
  /** display text after formatting and before exporting */
  public showPreview = false;

  /** holds the text that will be exported as preview */
  public processedText = null;

  /** holds selected current word */
  public currentWord: Word = null;

  //TODO: Implement clean solution.
  /** holds previously selected word */
  public previousWord: Word = null;

  /** holds the new value to add new word  */
  public newValue = new Object() as Word;

  /* the words for the view. */
  private words$: Observable<Word[]>;

  /* the warnings to be displayed. */
  private warnings$: Observable<string[]>;

  @ViewChild('input_currentValue') input_currentValue

  // Life Cycle Hooks
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private ctestService: CtestService
  ) { }

  ngOnInit(): void {
    this.newValue.value = '';
    this.newValue.showAlternatives = false;
    this.newValue.gapStatus = false;
    this.newValue.boldStatus = false;
    this.newValue.alternatives = []

    // This is just a workaround until this gets refactored. Should use observables below.
    this.ctestService.getCTest().subscribe(
      success => this.words = success.words,
      failure => console.error(failure)
    )

    // For future use. Observables to store the actual data.
    const response$: Observable<{ words: Word[], warnings: string[] }> = this.ctestService.getCTest();
    this.words$ = response$.pipe(
      map(response => response.words)
    )
    this.warnings$ = response$.pipe(
      map(response => response.warnings)
    )
  }


  /** * * * * * * * * PRIVATE METHODS * * * * * * * * * */
  private makeBold(word: string): string {
    return `<strong>${word}</strong>`;
  }

  /**
   * Export html to PDF and open download dialog
   * @param title File name to be saved
   */
  private processPDFFile(title) {
    const doc = new jsPDF();
    doc.fromHTML(
      this.processedText,
      15,
      15,
      {
        'width': 180, 'elementHandlers': (a) => console.log(a)
      }
    );
    doc.save(title);
    return;
  }

  /** * * * * * * * * PUBLIC METHODS * * * * * * * * * */
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
   * Ask user to Export html to txt/pdf
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
        this.processPreview();
        switch (data.options.selectedValue) {
          case 'PDF':
            this.processPDFFile(data.file.title);
            break;

          case 'Text':
            const div = document.createElement('div');
            div.innerHTML = this.processedText;
            const doc = document.createElement('a');
            doc.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(div.innerText)),
              doc.setAttribute('download', (data.file.title + '.txt'));
            doc.click();
            break;
        }
      }, no: 'Cancel', yes: 'Export'
    };
    this.dialog.open(ModalDialogComponent, { width: '', data });
  }

  /**
   * Set Current Clicked Word to be Configurable
   */
  public onWordClick(word: Word) {
    if (this.currentWord !== word) {
      this.previousWord = this.currentWord;
      this.currentWord = word;
      word.boldStatus = true;
      this.previousWord.boldStatus = false;
    }
  }

  /**
   * Toggles the gap status of the given word.
   * Reapplies the gapscheme starting at the given word.
   */
  public toggleGapStatus(word: Word) {
    word.gapStatus = !word.gapStatus;

    console.log(word.id);
    let startId = word.id;
    let text = this.words
      .slice(startId)
      .map((token: Word) => token.value)
      .join(" ")

    this.ctestService.fetchPartialCTest(text, this.ctestService.getLanguage(), !word.gapStatus).subscribe(
      success => {
        console.log(success.words[0].id);
        let words = success.words;

        for (let i = 0; i < words.length; i++) {
            words[i].id = startId + i;
        }

        console.log(this.words.slice(startId))
        this.words.splice(startId, words.length, ...words);
        console.log(this.words.slice(startId))
      },
      failure => console.error(failure)
    );
  }

  /** Process data before being exported  */
  public processPreview() {
    let words = '';
    const replace = new ReplacePipe().transform;
    this.words.forEach((word: Word) => {
      if (word.boldStatus) {
        words += ` ${this.makeBold(replace(word.value, word.offset, !word.gapStatus))} ${(word.showAlternatives &&
          word.alternatives.length > 0) ? ('/ ' + word.alternatives.join(' /')) : ''}`;
      } else {
        words += ` ${replace(word.value, word.offset, !word.gapStatus)} ${(word.showAlternatives && word.alternatives.length > 0) ?
          ('/ ' + word.alternatives.join(' /')) : ''} `;
      }
    });
    this.processedText = `<p>${words} </p>`;
  }

  public toggleAlternativesView() {
    this.words.forEach((word: Word) => {
      word.showAlternatives = !word.showAlternatives;
    })
  }

  /** adding alternative for current selected word */
  public addAlternative(word: Word): void {
    word.alternatives.push('');
  }

  /** updates the alternative word with each change */
  public onWordAlternativeChange(word: Word, index: number, event: Event) {
    word.alternatives[index] = (event.target as HTMLInputElement).value;
  }

  public onWordAlternativeCloseClick(word: Word, index: number) {
    word.alternatives.splice(index, 1);
  }

  /** Calculate total gapes enabled for each word */
  public calculateGaps() {
    return this.words.filter((word: Word) => Boolean(word.gapStatus)).length;
  }


  /**
   * delete Current Word
   */
  public delete() {
    this.words.splice(this.words.indexOf(this.currentWord), 1);
    this.currentWord = null;
  }

  public addNewWord(input: any) {

    let result = this.words.length - 1;
    this.words.splice(++result, 0, ({
      offset: 3,
      showAlternatives: false,
      value: 'new word',
      alternatives: [],
      boldStatus: false,
      id: Math.random() * 15,
      gapStatus: false
    } as Word));
    this.currentWord = this.words[result];
    setTimeout(() => {
      this.input_currentValue.nativeElement.select();
      console.log(this.input_currentValue.nativeElement.focus());
    });
    //this.isEditMode = true;
  }
}

import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';
import { Word } from '../shared/models/word';
import { TestviewPipe } from '../shared/pipes/testview.pipe';
import { IosviewPipe } from '../shared/pipes/iosview.pipe';
import * as jsPDF from 'jspdf';
import { CtestService } from '../ctest.service';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { map } from '../../../node_modules/rxjs/operators/map';
import { TokenComponent } from './token/token.component';

@Component({
  selector: 'tp-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.scss']
})

export class TextEditComponent implements OnInit {
  /**
   *  Words in the current c-test.
   */
  public words: Word[] = []; //TODO: replace with observables.

  /**
   * Indicates whether view or edit mode is currently active.
   */
  public isEditMode = false;

  /**
   * Indicates whether text should be shown before export.
   */
  public showPreview = false;

  /**
   * The word currently selected.
   */
  public currentWord: Word = null;

  //TODO: Implement clean solution.
  /**
   * The previously selected word.
   */
  public previousWord: Word = null;

  /**
   * The {@code TokenComponent} associated with the current word.
   */
  public currentComponent: TokenComponent = null;

  /**
   * An empty word. To be used as a template for new words.
   */
  public newValue: Word = new Object() as Word;

  /**
   * Observable of words in the c-test.
   */
  private words$: Observable<Word[]>;

  /**
   * Observable of warning messages to be displayed.
   */
  private warnings$: Observable<string[]>;

  //TODO: What does this do?
  @ViewChild('input_currentValue') input_currentValue;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private ctestService: CtestService
  ) { }

  ngOnInit(): void {
    this.newValue.value = '';
    this.newValue.gapStatus = false;
    this.newValue.alternatives = []
    this.newValue.id = -1;
    this.newValue.isNormal = true;

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
   * Sets the given word as the current word. Also sets the previously selected word.
   */
  public onWordClick(word: Word) {
    if (this.currentWord !== word) {
      this.previousWord = this.currentWord;
      this.currentWord = word;
    }
  }

  /**
   * Update the gaps in the c-test, starting from the given token.
   *
   * All tokens following the given token are sent to the webservice
   * and their gap status is updated according to normal gapping rules.
   */
  updateGaps(word: Word) {
    let start: number = this.words.indexOf(word) + 1;
    let toUpdate: Word[] = this.words.slice(start);
    this.ctestService.fetchUpdatedGaps(toUpdate, !word.gapStatus).subscribe(
      success => {
        let words = success;
        this.words.splice(start, words.length, ...words)
      },
      failure => console.error(failure)
    );
  }

  /**
   * Reapplies the gapscheme starting at the given word.
   */
  public reapplyGapscheme(word: Word) {
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

  /**
   * Toggles whether alternative solutions should be shown in the preview.
   */
  public toggleAlternativesView() {
    //TODO: Implement
  }

  /**
   * Adds an alternative to the given word.
   */
  public addAlternative(word: Word): void {
    word.alternatives.push('');
  }

  /**
   * Updates the alternative word with each change
   */
  public onWordAlternativeChange(word: Word, index: number, event: Event) {
    word.alternatives[index] = (event.target as HTMLInputElement).value;
  }

  public onWordAlternativeCloseClick(word: Word, index: number) {
    word.alternatives.splice(index, 1);
  }

  /**
   * Handles the selection of a token in the edit container.
   * Closes all token components that are currently open and sets the current token component.
   * @param component The component that was selected.
   */
  public onTokenSelection(component: TokenComponent) {
    if (this.currentComponent === null) {
      this.currentComponent = component;
      return;
    }

    if (this.currentComponent !== component) {
      this.currentComponent.close();
      this.currentComponent = component;
    }
  }

  /**
   * Deletes the given token from the list of tokens.
   */
  public deleteToken(token: Word) {
    const index: number = this.words.indexOf(token);
    if (index !== -1) {
      this.words.splice(index, 1);
    }
  }

  /**
   * Calculate total gapes enabled for each word
   */
  public calculateGaps() {
    return this.words.filter((word: Word) => Boolean(word.gapStatus)).length;
  }


  /**
   * Deletes the currently selected word.
   */
  public delete() {
    this.words.splice(this.words.indexOf(this.currentWord), 1);
    this.currentWord = null;
  }

  public addNewWord(input: any) {

    let result = this.words.length - 1;
    this.words.splice(++result, 0, ({
      offset: 3,
      value: 'new word',
      alternatives: [],
      id: Math.random() * 15,
      gapStatus: false,
      isNormal: true
    } as Word));
    this.currentWord = this.words[result];
    setTimeout(() => {
      this.input_currentValue.nativeElement.select();
      console.log(this.input_currentValue.nativeElement.focus());
    });
  }
}

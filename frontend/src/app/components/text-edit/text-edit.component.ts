import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Word, Token } from '../../models/word';
import { CtestService } from '../../services/ctest.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { StateManagementService } from '../../services/state-management.service';

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
   * The number of gaps in the current c-test.
   */
  public gaps: number = 0;

  /**
   * Indicates whether text should be shown before export.
   */
  public showPreview = false;

  /**
   * Observable of words in the c-test.
   */
  public words$: Observable<Word[]>;

  /**
   * Observable of warning messages to be displayed.
   */
  public warnings$: Observable<string[]>;

  /**
   * Indicates whether the gapscheme should be updated automatically.
   */
  public autoUpdate;

  constructor(
    private router: Router,
    private ctestService: CtestService,
    private stateService: StateManagementService
  ) { }

  ngOnInit(): void {
    this.autoUpdate = true;

    this.stateService.words$.subscribe(success => {
      this.words = success;
      this.gaps = this.words.filter(word => word.gapStatus).length;
    });

    // This is just a workaround until this gets refactored. Should use observables below.
    this.ctestService.getCTest().subscribe(
      success => this.stateService.addAll(success.words),
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
   * Adds a new word to the current words in the c-test.
   */
  public addNewWord() {
    const word: Token = new Token();
    word.value = 'new word';
    word.offset = 4;
    this.stateService.add(word);
  }

  /**
   * Updates the list of words, when a word is dropped in a different position.
   * @param $event a ngxDragAndDrop Event.
   */
  public onDrop($event: { value: Word, dropIndex: number }) {
    this.stateService.move($event.value, $event.dropIndex);
    if (this.autoUpdate) {
      const start: number = Math.max($event.dropIndex - 1, 0);
      this.updateGaps(this.words[start]);
    }
  }

  /**
   * Deletes the given word from the list of words.
   */
  public onTokenDeletion(word: Word) {
    const index: number = this.words.indexOf(word);
    if (index !== -1) {
      this.words.splice(index, 1);
    }
  }

  /**
   * Updates the Gap Scheme, when a gap is changed.
   */
  public onGapChange(word: Word) {
    if (this.autoUpdate) {
      this.updateGaps(word);
    }
  }

  /**
   * Updates the list of words with the given word.
   */
  public onTokenModification(word: Word) {
    this.stateService.modify(word);
  }

  /**
   * Navigates back to the c-test upload page.
   */
  public routeToHome() {
    this.router.navigate(['']);
  }

  /**
   * Update the gaps in the c-test, starting from the given token.
   *
   * All tokens following the given token are sent to the webservice
   * and their gap status is updated according to normal gapping rules.
   */
  public updateGaps(word: Word) {
    const start: number = this.words.findIndex(token => token.id === word.id) + 1;
    const toUpdate: Word[] = this.words.slice(start);

    this.ctestService.fetchUpdatedGaps(toUpdate, !word.gapStatus).subscribe(
      success => {
        const regapped: Word[] = success;
        const unchanged: Word[] = this.words.slice(0,start);
        const newState = unchanged.concat(regapped);
        this.stateService.set(newState);
      },
      failure => console.error(failure)
    );
  }

  public updateAllGaps() {
    const firstNormal = this.words.find(word => word.isNormal);
    this.updateGaps(firstNormal);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Word, Token } from '../../models/word';
import { CtestService } from '../../services/ctest.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { StateManagementService } from '../../services/state-management.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { HelpPageComponent } from './help-page/help-page.component';

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
   * A subject for unsubscribing all subscriptions at once.
   * When the subject emits true, all subscriptions connected to this subject are unsubscribed.
   */
  public unsubscribe$: Subject<boolean>;

  /**
   * Indicates whether the gapscheme should be updated automatically.
   */
  public autoUpdate;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private ctestService: CtestService,
    public stateService: StateManagementService
  ) { }

  ngOnInit(): void {
    this.autoUpdate = true;

    this.unsubscribe$ = new Subject<boolean>();

    this.stateService.words$.pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(success => {
      this.words = success;
      this.gaps = this.words.filter(word => word.gapStatus).length;
    });

    this.ctestService.getCTest().subscribe(
      success => this.stateService.addAll(success.words),
      failure => console.error(failure)
    )

    const response$: Observable<{ words: Word[], warnings: string[] }> = this.ctestService.getCTest();
    this.words$ = response$.pipe(
      map(response => response.words)
    )
    this.warnings$ = response$.pipe(
      map(response => response.warnings)
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
    this.stateService.clear();
    this.stateService.clearHistory();
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
   * Opens the help page.
   */
  public openHelp() {
    this.dialog.open(HelpPageComponent);
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
    const firstNormal: number = this.words.findIndex(word => word.isNormal);
    const toUpdate: Word[] = this.words.slice(firstNormal);

    this.ctestService.fetchUpdatedGaps(toUpdate, false).subscribe(
      success => {
        const regapped: Word[] = success;
        const unchanged: Word[] = this.words.slice(0, firstNormal);
        const newState = unchanged.concat(regapped);
        this.stateService.set(newState);
      },
      failure => console.error(failure)
    );
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Word, Token } from '../../models/word';
import { CtestService } from '../../services/ctest.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StateManagementService } from '../../services/state-management.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HelpPageComponent } from './help-page/help-page.component';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.scss']
})

export class TextEditComponent implements OnInit, OnDestroy {
  /**
   * The default number of gaps that a test should hold.
   */
  public static readonly DefaultTestSize = 20;

  /**
   * The default interval of gaps.
   */
  public static readonly DefaultGapInterval = 2;


  /**
   *  Words in the current c-test.
   */
  public words: Word[] = []; //TODO: replace with observables.

  /**
   * The number of gaps in the current c-test.
   */
  public gaps = 0;

  /**
   * The desired number of gaps in the c-test.
   */
  public gapCountTarget: number = TextEditComponent.DefaultTestSize;


  /**
   * The desired interval of gaps in the c-test.
   */
  public gapInterval: number = TextEditComponent.DefaultGapInterval;


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
  public autoUpdate: boolean;

  /**
   * Indicates whether the test difficulty should be updated automatically.
   */
  public autoUpdateDifficulty: boolean;

  /**
   * Indicates, whether the difficulty should be shown on each token.
   */
  public showDifficulty: boolean;

  /**
   * The difficulty of the current c-test.
   */
  public difficulty: number;

  /**
   * The color for the difficulty display.
   */
  public difficultyColor: string = environment.colors.difficulty.colors.normal.invalid;

  /**
   * The title of the c-test.
   */
  public title: string;

  /**
   * Indicates whether title edit mode is active.
   */
  public titleEdit: boolean;


  private colorMapper = environment.colors.difficulty.map;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private ctestService: CtestService,
    public stateService: StateManagementService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.autoUpdate = true;
    this.autoUpdateDifficulty = false;
    this.showDifficulty = true;
    this.setDifficulty(-1);

    // subject for unsubscribing on component desctruction
    this.unsubscribe$ = new Subject<boolean>();

    // update words, whenever stateservice has new state.
    this.stateService.words$.pipe(
      takeUntil(this.unsubscribe$.observers)
    )
    .subscribe(success => {
      this.words = success;
      this.gaps = success.filter(token => token.gapStatus).length;
      this.difficulty = this.ctestService.calculateDifficulty(success);
    });

    // generate initial c-test
    this.ctestService.getCTest().subscribe(
      success => this.stateService.addAll(success.words),
      failure => console.error(failure)
    );

    if (this.ctestService.getTitle() !== 'export') {
      this.title = this.ctestService.getTitle().replace(/_/g, ' ');
      this.titleEdit = false;
    } else {
      this.title = '';
      this.titleEdit = true;
    }

    const response$: Observable<{ words: Word[], warnings: string[] }> = this.ctestService.getCTest();
    this.words$ = response$.pipe(
      map(response => response.words)
    );
    this.warnings$ = response$.pipe(
      map(response => response.warnings)
    );
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
      if (this.autoUpdate) {
        this.updateGaps(this.words[start]);
        if (this.autoUpdateDifficulty) {
          this.updateDifficulty(this.words);
        }
      }
    }
  }

  /**
   * Deletes the given word from the list of words.
   */
  public onTokenDeletion(word: Word) {
    const index: number = this.words.findIndex(other => word.id === other.id);
    if (index !== -1) {
      this.words.splice(index, 1);
    }

    if (this.autoUpdateDifficulty) {
      this.updateDifficulty(this.words);
    }
  }

  /**
   * Updates the Gap Scheme, when a gap is changed.
   */
  public onGapChange(word: Word) {
    if (this.autoUpdate) {
      this.updateGaps(word);
      if (this.autoUpdateDifficulty) {
        this.updateDifficulty(this.words);
      }
    }
  }

  /**
   * Updates the list of words with the given word.
   */
  public onTokenModification(word: Word) {
    const words = this.words.map(other => other.id === word.id ? word : other);
    this.stateService.set(words);
    this.setDifficulty(-1);
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
   * Update is perfomed **in-place**.
   */
  public updateGaps(word: Word) {
    const start: number = this.words.findIndex(token => token.id === word.id) + 1;
    const offset = word.gapStatus ? 1 : 0;
    const previous = this.words.slice(0, start);
    const after = this.words.slice(start);
    const previousGapCount = previous.filter(token => token.gapStatus).length;
    const missingGaps = this.gapCountTarget - previousGapCount;

    // add missing gaps
    if (missingGaps >= 0) {
      after
        .forEach(token => token.gapStatus = false);
      after
        .filter(token => token.isNormal)
        .filter((token, i) => this.isGap(i + offset))
        .slice(0, missingGaps)
        .forEach(token => token.gapStatus = true);
    // remove unnecessary gaps
    } else {
      previous
        .filter(token => token.gapStatus)
        .reverse()
        .slice(1, Math.abs(missingGaps) + 1)
        .forEach(token => token.gapStatus = false);
    }
  }

  /**
   * Updates all gaps in the c-test, starting from the first non-locked gap.
   */
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


  /**
   * Indicates whether the given index should be gapped.
   */
  private  isGap(index: number): boolean {
    return index % this.gapInterval === 0;
  }

  public onTitleKeyup(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case 'Escape': this.titleEdit = false;
    }
  }

  public updateDifficulty(words: Word[]) {
    this.snackBar.open('Recalculating difficulties...', 'OK');
    this.ctestService.fetchDifficulty(words)
    .subscribe(
      success => {
        this.setDifficulty(this.ctestService.calculateDifficulty(success));
        this.stateService.set(success);
        this.snackBar.open('Success!', 'OK', { duration: 1500 });
      },
      error => this.snackBar.open('ERROR: Could not retrieve difficulties!', 'OK', { duration: 3500 })
    );
  }

  public setDifficulty(difficulty: number) {
    this.difficulty = difficulty;
    this.difficultyColor = this.colorMapper(difficulty);
  }
}

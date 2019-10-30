import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Word, Token } from '../../../models/word';
import { MatChipInputEvent } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import * as Color  from 'color';

@Component({
  selector: 'tp-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {

  /**
   * The token to be displayed and edited.
   */
  @Input('token')
  public token: Word;

  /**
   * Indicates, whether a backdrop should be present when the edit ui is active.
   * The backdrop prevents users to access ui elements other than the edit ui,
   * when the edit ui is opened.
   *
   * Defaults to 'true'.
   */
  @Input('backdrop')
  public backdrop: boolean = true;

  @Input()
  public showDifficulty: boolean = true;

  /**
   * Emits the token when the gap status was changed.
   */
  @Output('gapChange')
  public gapChange$: EventEmitter<Word>;

  /**
   * Emits the token when it should be deleted.
   */
  @Output('delete')
  public delete$: EventEmitter<Word>;

  /**
   * Emits the token when it was modified.
   */
  @Output('modify')
  public modify$: EventEmitter<Word>;

  /**
   * Emits when the token was selected.
   */
  @Output('select')
  public select$: EventEmitter<TokenComponent>;

  /**
   * A subject for unsubscribing all subscriptions at once.
   * When the subject emits true, all subscriptions connected to this subject are unsubscribed.
   */
  public unsubscribe$: Subject<boolean>;

  private colormap = environment.colors.difficulty.map;

  private hover = false;

  /**
   * Color of the difficulty underline for this token.
   */
  private color: string;

  /**
   * Color of the difficulty underline for this token.
   */
  private backGroundColor: string;

  /**
   * Temporary token to which changes are applied, before the user saves all changes.
   */
  private tempToken: Token;


  /**
   * Token used for backups, when the user cancels their edit.
   */
  private backupToken: Word;

  /**
   * Indicates whether the component is selected.
   */
  public selected: boolean;

  /**
   * Indicates whether text is being edited.
   */
  private textEdit: boolean;

  /**
   * Indicates whether alternative solutions are being edited.
   */
  private alternativesEdit: boolean;

  /**
   * The keycodes which trigger an alternative to be added to the list of alternatives.
   */
  private alternativesAddKeys: number[] = [
    188, // comma
    190, // dot
    32, // space
    13, // enter
  ]

  /**
   * Indicates whether a double click on the token was triggered.
   * The click event on the token should be prevented.
   * This is necessary to enable double click behaviour for tokens without
   * causing a click event as well.
   *
   * @see TokenComponent.onClick
   * @see TokenComponent.onDoubleClick
   */
  private doubleClick: boolean = false;

  /**
   * The the delay for a double click to register.
   */
  private doubleClickDelay: number = 233;

  /**
   * The timer for the click event.
   */
  private clickTimer: number;

  constructor() {
    this.gapChange$ = new EventEmitter<Word>();
    this.delete$ = new EventEmitter<Word>();
    this.select$ = new EventEmitter<TokenComponent>();
    this.modify$ = new EventEmitter<Word>();
    this.unsubscribe$ = new Subject<boolean>();
    this.tempToken = new Token();
    this.selected = false;
    this.textEdit = false;
    this.alternativesEdit = false;
  }

  ngOnInit() {
    this.select$.pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(
      token => {
        this.tempToken = new Token();
        this.tempToken.set(this.token);
        this.backupToken = this.token;
        this.token = this.tempToken;
      }
    );

    this.modify$.pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(modified => this.updateColors(modified));

    this.updateColors(this.token);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  public activateTextEdit() {
    this.textEdit = true;
    this.alternativesEdit = false;
  }

  public activateAlternativesEdit() {
    this.textEdit = false;
    this.alternativesEdit = true;
  }

  private updateColors(token: Word) {
    // TODO: implement logic, once tokens are refactored.
    const difficulty = Math.random();
    this.color = this.colormap(difficulty);
    this.backGroundColor = this.colormap(difficulty, false);
  }

  /**
   * Increments the gap index of the token.
   */
  private incrementIndex() {
    if (this.tempToken.offset < this.tempToken.value.length) {
      this.tempToken.offset++;

      this.tempToken.alternatives = this.tempToken.alternatives
        .map((alternative: string) => {
          return alternative.substring(1, alternative.length); // remove first char
        })
        .filter((alternative: string) => {
          const firstSolutionChar: string = this.tempToken.value.charAt(this.tempToken.offset);
          return alternative.charAt(0) === firstSolutionChar; // remove alternative if it does not start with same char as solution
        });
    }
  }

  /**
   * Decrements the gap index of the token.
   */
  private decrementIndex() {
    if (this.tempToken.offset > 0) {
      this.tempToken.offset--;

      // Add last character to all alternatives
      this.tempToken.alternatives = this.tempToken.alternatives.map((alternative: string) => {
        return this.tempToken.value.charAt(this.tempToken.offset) + alternative;
      });
    }
  }

  /**
   * Adds an alternative to the token
   */
  public addAlternative(event: MatChipInputEvent) {
    const alternative: string = event.value.trim();
    const input: HTMLInputElement = event.input;

    if (alternative) {
      this.tempToken.alternatives.push(alternative);
    }

    if (input) {
      input.value = '';
    }
  }

  /**
   * Toggles the gap status of the temporary token.
   */
  public toggleGap() {
    this.tempToken.gapStatus = !this.tempToken.gapStatus;
    if (this.tempToken.gapStatus) {
      this.tempToken.isNormal = true;
    }
  }

  /**
   * Toggles the gap lock status of the temporary token.
   * Locked tokens will be ignored by the gapscheme, when reallocating gaps.
   */
  public toggleLock() {
    this.tempToken.isNormal = !this.tempToken.isNormal;
    if (!this.tempToken.isNormal) {
      this.tempToken.gapStatus = false;
    }
  }

  /**
   * Removes the given alternative from the alternative solutions list of the token.
   */
  public removeAlternative(alternative: string) {
    const index: number = this.tempToken.alternatives.indexOf(alternative);
    if (index !== -1) {
      this.tempToken.alternatives.splice(index, 1);
    }
  }

  /**
   * Handles user input in textedit mode.
   */
  public closeEditFieldsIfEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.textEdit = false;
      this.alternativesEdit = false;
    }
  }

  /**
   * Applies changes to the actual token.
   */
  public apply() {
    this.modify$.emit(this.tempToken);
    if (this.token.gapStatus !== this.backupToken.gapStatus) {
      this.gapChange$.emit(this.tempToken);
    }
    this.token = new Token(this.tempToken);
    this.close();
  }

  /**
   * Discards changes made to the temporary token.
   */
  public discard() {
    this.token = this.backupToken;
    this.tempToken.set(this.token);
    this.close();
  }

  /**
   * Sends a signal to delete the token.
   * Note that this does not directly delete the token.
   * The actual deletion has to be handled by the parent component.
   */
  public delete() {
    this.delete$.emit(this.token);
    this.close();
  }

  /**
   * Selects this component and sets the edit UI active.
   */
  public select() {
    this.selected = true;
    this.select$.emit(this);
  }

  /**
   * Closes the edit ui.
   */
  public close() {
    this.selected = false;
  }

  /**
   * Handles click events on a token.
   */
  public onTokenClick() {
    let component = this;
    this.clickTimer = window.setTimeout(function () {
      if (!component.doubleClick) {
        component.select();
      } else {
        component.doubleClick = false;
      }
    }, this.doubleClickDelay);
  }

  /**
   * Handles doubleclick events on a token.
   */
  public onTokenDoubleClick() {
    console.log('double click');
    this.doubleClick = true;
    window.clearTimeout(this.clickTimer);
    this.select$.emit(this);
    this.toggleGap();
    this.apply();
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Word, Token } from '../../shared/models/word';
import { MatChipInputEvent } from '@angular/material';

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
   */
  @Input('backdrop')
  public backdrop: boolean = false;

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
   * Emits when the token was selected.
   */
  @Output('select')
  public select$: EventEmitter<TokenComponent>;

  //TODO: Change to tempToken
  /**
   * Temporary token to which changes are applied, before the user saves all changes.
   */
  private tempToken: Token;

  /**
   * Indicates whether the component is selected.
   */
  private selected: boolean;

  /**
   * Indicates whether text is being edited.
   */
  private textEdit: boolean;

  /**
   * Indicates whether alternative solutions are being edited.
   */
  private alternativesEdit: boolean;

  /**
   * Indicates whether this token should be ignored by the automatic gapping procedure.
   */
  private locked: boolean;

  /**
   * The keycodes which trigger an alternative to be added to the list of alternatives.
   */
  private alternativesAddKeys: number[] = [
    188, // comma
    190, // dot
     32, // space
  ]

  constructor() {
    this.gapChange$ = new EventEmitter<Word>();
    this.delete$ = new EventEmitter<Word>();
    this.select$ = new EventEmitter<TokenComponent>();
    this.tempToken = new Token();
    this.selected = false;
    this.textEdit = false;
    this.alternativesEdit = false;
    this.locked = false;
  }

  ngOnInit() {
    this.select$.subscribe(
      token => {
        this.tempToken = new Token();
        this.tempToken.set(this.token);
      }
    )
  }

  /**
   * Increments the gap index of the token.
   */
  private incrementIndex() {
    if (this.tempToken.offset < this.tempToken.value.length)
      this.tempToken.offset ++;
  }

  /**
   * Decrements the gap index of the token.
   */
  private decrementIndex() {
    if(this.tempToken.offset > 0)
      this.tempToken.offset --;
  }

  /**
   * Adds an alternative to the token
   */
  private addAlternative(event: MatChipInputEvent) {
    const alternative: string = event.value.trim();
    const input: HTMLInputElement = event.input;

    if(alternative)
      this.tempToken.alternatives.push(alternative);

    if(input)
      input.value = '';
  }

  /**
   * Removes the given alternative from the alternative solutions list of the token.
   */
  removeAlternative(alternative: string) {
    const index: number = this.tempToken.alternatives.indexOf(alternative);
    if(index !== -1) {
      this.tempToken.alternatives.splice(index, 1);
    }
  }

  /**
   * Handles user input in textedit mode.
   */
  private closeEditFieldsIfEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this.textEdit = false;
      this.alternativesEdit = false;
    }
  }

  /**
   * Applies changes to the actual token.
   */
  private apply() {
    if(this.token.gapStatus !== this.tempToken.gapStatus) {
      this.gapChange$.emit(this.tempToken);
    }
    this.token = this.tempToken;
    this.tempToken = new Token();
    this.tempToken.set(this.token);
    this.close()
  }

  /**
   * Discards changes made to the temporary token.
   */
  private discard() {
    this.tempToken.set(this.token);
    this.close();
  }

  /**
   * Sends a signal to delete the token.
   * Note that this does not directly delete the token.
   * The actual deletion has to be handled by the parent component.
   */
  private delete() {
    this.delete$.emit(this.token);
    this.close();
  }

  /**
   * Selects this component and sets the edit UI active.
   */
  private select() {
    this.selected = true;
    this.select$.emit(this);
  }

  /**
   * Closes the edit ui.
   */
  public close() {
    this.selected = false;
  }
}

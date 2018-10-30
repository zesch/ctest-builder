import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Word, Token } from '../../shared/models/word';

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
   * Emits the token when the gap status was changed.
   */
  @Output('gapChange')
  public gapChange$: EventEmitter<Word>;

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

  constructor() {
    this.gapChange$ = new EventEmitter<Word>();
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
   * Handles user input in textedit mode.
   */
  private handleTextEditKeyup(event: KeyboardEvent) {
    if (event.keyCode == 13 || event.keyCode == 27) {
      this.textEdit = false;
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
   * Deletes the token.
   */
  private delete() {
    //TODO: delete
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

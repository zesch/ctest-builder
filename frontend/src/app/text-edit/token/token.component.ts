import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Word } from '../../shared/models/word';

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
  public select$: EventEmitter<Word>;

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
   * Increments the gap index of the token.
   */
  private incrementIndex() {
    if (this.token.offset < this.token.value.length)
      this.token.offset ++;
  }

  /**
   * Decrements the gap index of the token.
   */
  private decrementIndex() {
    if(this.token.offset > 0)
      this.token.offset --;
  }

  /**
   * Handles user input in textedit mode.
   */
  private handleTextEditKeyup(event: KeyboardEvent) {
    if (event.keyCode == 13 || event.keyCode == 27) {
      this.textEdit = false;
    }
  }

  constructor() { }

  ngOnInit() {
    this.gapChange$ = new EventEmitter<Word>();
    this.select$ = new EventEmitter<Word>();
    this.selected = false;
    this.textEdit = false;
    this.alternativesEdit = false;
    this.locked = false;
  }
}

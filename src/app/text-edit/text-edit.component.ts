import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TextService } from '../text.service';
import { Text } from '../text';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.css'],
  providers: [TextService, LoggerService]
})
export class TextEditComponent implements OnInit {
  paragraph: Text[];
  selectedText: Text;
  negator: boolean = true;
  showOriginal: Boolean = false;
  hiddenCount: number = 0;

  constructor(private textService: TextService,
    private router: Router,
    private loggerService: LoggerService
  ) { }

  getParagraph(): void {
    this.textService
      .getParagraph()
      .then(res => this.paragraph = res);
  }

  toggleOriginal() {
    this.loggerService.log('show Original ' + this.showOriginal);
    this.showOriginal = !this.showOriginal;
  }

  ngOnInit() {
    // this.textService.setParagraph("test apple. banana, cat.");
    this.getParagraph();
  }

  toggleText(text): void {
    this.loggerService.log('click - ' + JSON.stringify(text));
    text.isHidden = !text.isHidden;
  }

  onSelect(text: Text): void {
    this.selectedText = text;
  }

  setOthers(): void {
  //   for (let i = this.selectedText.id; i < this.paragraph.length; i = i + 2) {
  //     if (this.selectedText.isHidden == true) {
  //       this.paragraph[i].isHidden = true;
  //       this.paragraph[i + 1].isHidden = false;
  //     } else {
  //       this.paragraph[i].isHidden = false;
  //       this.paragraph[i + 1].isHidden = true;
  //     }
  //   }
  }

  update(newText: Text): void {
      this.loggerService.log('update ' + JSON.stringify(newText)  );
      this.loggerService.log('value ' + newText.value + "  after hide  " + this.textService.hideTextService(newText.value) );
      this.paragraph[newText.id -1 ].cValue = this.textService.hideTextService(newText.value);
  }
  export(): void {

  }
}

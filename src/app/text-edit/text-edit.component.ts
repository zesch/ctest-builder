import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Text } from '../text';
import { TextService } from '../text.service';
import { LoggerService } from '../logger.service';
import { SubmitTextService } from "app/submit-text.service";
import { Subscription }   from 'rxjs/Subscription';
import { MdDialog,MdDialogRef } from "@angular/material";
import { TextEditDialogComponent } from "app/text-edit-dialog/text-edit-dialog.component";

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.css'],
  providers: [TextService, LoggerService]
})
export class TextEditComponent implements OnInit, OnDestroy {
  paragraph: Text[];
  
  selectedText: Text;
  negator: boolean = true;
  showOriginal: Boolean = false;
  hiddenCount: number = 0;
  solutions: number[] = [];
  simpleDrop: number = -1;
  subscription: Subscription;
  text: string;
  error: string;
  addedText: string;
  color: string;



  constructor(private textService: TextService,
    private router: Router,
    private loggerService: LoggerService,
    private submitTextService: SubmitTextService,
    public dialog: MdDialog
  ) { }

  setNullSelectedtext(){
    let emptyStringArr: string[] = [' '];
    this.selectedText = {
            id: 0,
            value: emptyStringArr,
            cValue: ' ',
            isHidden: false
        }
  }

  goBack() {
    let dialogRef = this.dialog.open(TextEditDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if(res == 'Yes'){
        this.router.navigate(['/index']);
      };
    });

     
  }

  getParagraph(): void {
    this.textService
      .getParagraph()
      .then(res => {
        this.paragraph = res;

      });
  }

  toggleOriginal() {
    this.loggerService.log('show Original ' + this.showOriginal);
    this.showOriginal = !this.showOriginal;
  }

  ngOnInit() {
    this.getSubmitedText();
    this.textService.setParagraph(this.text);
    this.getParagraph();
    this.setNullSelectedtext();
  }

  getSubmitedText(){

    this.text = this.submitTextService.textSource1;
    this.loggerService.log(this.text + ' text1  ');
    
  }

  toggleText(text): void {
    this.loggerService.log('click - ' + JSON.stringify(text));
    text.isHidden = !text.isHidden;
  }

  onSelect(text: Text): void {
    this.selectedText = text;
    // this.selectedText.value[1] = 'apple';
    this.solutions = this.countSolutions(text);
  }

  countSolutions(text): number[]{
    let res: number[] = [];
    let i: number = 0;
    while(text.value[i] != null){
      res.push(i);
      i++;
    }
    return res;
  }

  setOthers(): void {
    for (let i = this.selectedText.id; i < this.paragraph.length; i = i + 2) {
      if (this.selectedText.isHidden == true) {
        this.paragraph[i].isHidden = true;
        this.paragraph[i + 1].isHidden = false;
      } else {
        this.paragraph[i].isHidden = false;
        this.paragraph[i + 1].isHidden = true;
      }
    }
  }

  addSolution(): void{
    this.loggerService.log(this.selectedText.id);
    //this.paragraph[this.selectedText.id].value.push(newSolution);
    this.solutions.push(this.solutions[this.solutions.length - 1] + 1);
    this.loggerService.log(this.paragraph[this.selectedText.id].value);
  }

  update(newText: Text): void {
      this.loggerService.log('update ' + JSON.stringify(newText)  );
      this.loggerService.log('value ' + newText.value + "  after hide  " + this.textService.hideTextService(newText.value[0]) );
      this.paragraph[newText.id -1 ].cValue = this.textService.hideTextService(newText.value[0]);
      this.setNullSelectedtext();
  } 

  add(newText: string, id: number): void{
      if(newText == null) return;
      this.loggerService.log('add ' + JSON.stringify(newText)  );
      let value: string[] = [newText];
      let text = {
            id: id + 1,
            value: value,
            cValue: this.textService.hideTextService(newText),
            isHidden: false
      };
      this.paragraph.splice(id, 0, text);
      this.updateTextIds();
      this.simpleDrop = -1;
      this.addedText = '';
  }

  onDropSuccess(id: any){
    this.loggerService.log(id);
    this.simpleDrop = id;
  }

  onDeleteDropSuccess($event: any){
    this.loggerService.log($event.dragData);
    this.paragraph.splice($event.dragData - 1,1);
    this.updateTextIds();
  }

  createOutputText(){
    let outputText = "";
    for(let i = 0; i < this.paragraph.length; i = i + 1){
      if(this.paragraph[i].isHidden === true){
        outputText = outputText + this.paragraph[i].cValue + ' ';
      }else{
        outputText = outputText + this.paragraph[i].value[0] + ' ';
      }
    }
    outputText = outputText + '\n \n';
    for(let i = 0; i < this.paragraph.length; i = i + 1){
      for(let j = 0; j < this.paragraph[i].value.length; j = j + 1){
        outputText = outputText + this.paragraph[i].value[j];
        if(this.paragraph[i].value.length > 1 && j != this.paragraph[i].value.length - 1 ){
          outputText = outputText + '/';
        }
      }
      outputText = outputText + ' ';
    }
    return outputText;
  }

  export(): void {
    this.loggerService.log(this.createOutputText());
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.createOutputText()));
    element.setAttribute('download', 'c-test');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  updateTextIds() {
    for (let i = 0; i < this.paragraph.length; i++) {
      this.paragraph[i].id = i + 1;
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe();
  }
}


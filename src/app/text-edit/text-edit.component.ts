import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Text } from '../text';
import { Token } from 'app/token';
import { TextService } from '../text.service';
import { LoggerService } from '../logger.service';
import { SubmitTextService } from 'app/submit-text.service';
import { Subscription }   from 'rxjs/Subscription';
import { MdDialog,MdDialogRef, MdSnackBar} from '@angular/material';
import { TextEditDialogComponent } from 'app/text-edit-dialog/text-edit-dialog.component';
import { ReformatDialogComponent } from 'app/reformat-dialog/reformat-dialog.component';

import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';


@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.css'],
  providers: [TextService, LoggerService]
})
export class TextEditComponent implements OnInit, OnDestroy {
  paragraph: Text[];
  tokenizedFromApi: Token[];
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
  gapCount: number;
  totalCount: number;


  constructor(private textService: TextService,

    private router: Router,
    private loggerService: LoggerService,
    private submitTextService: SubmitTextService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private sesStorage:SessionStorageService
  ) { }
  
  ngOnInit() {
    this.getSubmitedText();
    
    this.getParagraph();
    //console.log("*********" + this.textService.getApiResult());
    this.selectedText = null;
  }
  
  goBack() {
    let dialogRef = this.dialog.open(TextEditDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if(res == 'Yes'){
        this.router.navigate(['/index']);
      };
    });


  }

  reformat() {
    let dialogRef = this.dialog.open(ReformatDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      for(let i = 1; i < this.paragraph.length; i++){
        this.paragraph[i].isHidden = false;
      }
    this.setGaps(res);
    this.countStatistics();
    });


  }

  setGaps(res): void{
    let count = res + 1;

    if(this.paragraph.length < res){
      this.snackBar.open('desired gap number is less than total words!',null,{
        duration:2000,
      })
    }else{
      for (let i = 1; i < this.paragraph.length; i = i + Math.floor(this.paragraph.length/res) - 1) {
        this.paragraph[i].isHidden = true;
        --count;
        if(--count < 1) break;
      }
    }
  }

  getParagraph(): void {
    // first get the result of Token[] from API 
    this.textService
    .getApiResult()
    .then(res => {
      this.tokenizedFromApi = res;
    });
    
    //send the tokenized text to back
    console.log(this.tokenizedFromApi);

    //this.textService.setParagraph(this.tokenizedFromApi);
    this.sesStorage.store('test', JSON.stringify(this.tokenizedFromApi));

    // and get the parsed version from back
    this.textService
      .getParagraph()
      .then(res => {
        this.paragraph = res;

        //TODO these 2 should be onit, but causing problems, maybe because of this async call
        this.setGaps(20);
        this.countStatistics();
        
      });


  }

  countStatistics(){
      this.gapCount = 0;
      this.totalCount = 0;
      for(let i = 0; i < this.paragraph.length; i++){
        this.totalCount++;
        if((!this.textService.isSymbolsService(this.paragraph[i].value[0])) && this.paragraph[i].isHidden === true) this.gapCount++;
      }
  }

  toggleOriginal() {
    this.loggerService.log('show Original ' + this.showOriginal);
    this.showOriginal = !this.showOriginal;
  }


  getSubmitedText(){
    //getting the text input from front page as a string and stores in this.text
    this.text = this.submitTextService.textSource1;
  }

  toggleText(text): void {
    this.loggerService.log('click - ' + JSON.stringify(text));
    text.isHidden = !text.isHidden;
    this.countStatistics();
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
    // for (let i = this.selectedText.id; i < this.paragraph.length; i = i + 2) {
    //   if (this.selectedText.isHidden == true) {
    //     this.paragraph[i].isHidden = true;
    //     this.paragraph[i + 1].isHidden = false;
    //   } else {
    //     this.paragraph[i].isHidden = false;
    //     this.paragraph[i + 1].isHidden = true;
    //   }
    // }
    for (let i = 1; i < this.paragraph.length; i = i + 2){
      this.paragraph[i].isHidden = true;
    }
  }

  addSolution(): void{
    //add an empty input bar for solution array
    this.loggerService.log(this.selectedText.id);
    //this.paragraph[this.selectedText.id].value.push(newSolution);
    this.solutions.push(this.solutions[this.solutions.length - 1] + 1);
    // this.loggerService.log(this.paragraph[this.selectedText.id].value);
    this.countStatistics();
  }


  deleteSolution(id: number):void{
    if(this.selectedText.value.length > 1){
      this.selectedText.value.splice(id, 1);
      this.solutions.pop();
    }else{
      this.snackBar.open('Can not delete the only solution!',null,{
        duration:2000,
      })
    }
    this.countStatistics();
  }

  update(newText: Text): void {
      //TODO user may put in cvalue manually
      this.loggerService.log('value ' + newText.value + '  after hide  ' + this.textService.hideTextService(newText.value[0], 3) );
      this.paragraph[newText.id].cValue = this.textService.hideTextService(newText.value[0], 3);
      //this.selectedText = null;
      this.loggerService.log('update ' + JSON.stringify(newText)  );
      this.countStatistics();
  }

  add(newText: string, id: number): void{
      if(newText == null) return;
      this.loggerService.log('add ' + JSON.stringify(newText)  );
      let value: string[] = [newText];
      let text = {
            id: id + 1,
            value: value,
            cValue: this.textService.hideTextService(newText, 3),
            isHidden: false
      };
      this.paragraph.splice(id + 1, 0, text);
      this.updateTextIds();
      this.simpleDrop = -1;
      this.addedText = '';
      this.selectedText = null;
      this.countStatistics();
  }//TODO when adding a new word, the bug still exists of setting wrong index: when double click it toggles the previous one, when add, its adds to next index

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
    let outputText = '';
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
      this.paragraph[i].id = i;
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe();
  }

  debug(){
    console.log(this.sesStorage.retrieve('test'));
    this.snackBar.open('haha');
  }
}


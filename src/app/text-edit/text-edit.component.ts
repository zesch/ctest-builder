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
  gappedTokens: string[];

  selectedToken: Token;
  negator: boolean = true;
  hiddenCount: number = 0;
  solutions: string[] = [];
  simpleDrop: number = -1;
  subscription: Subscription;
  text: string;
  error: string;
  addedText: string;
  color: string;
  gapCount: number;
  totalCount: number;
  currentGapsRecord: boolean[] = [];
  showingOriginal: boolean= false; // if this is true then its in preview mode


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
    //TODO post to back
    this.getParagraph();

    this.selectedToken = null;
  }
  
  getSubmitedText(){
    //getting the text input from front page as a string and stores in this.text
    this.text = this.submitTextService.textSource1;
  }

  getParagraph(): void {
    // first get the result of Token[] from API 
    this.textService
    .getApiResult(this.text)
    .then(res => {
      this.tokenizedFromApi = res;
      this.gapToken();
    });
    
    //send the tokenized text to back
    //console.log('%%%%',this.tokenizedFromApi);

    //this.textService.setParagraph(this.tokenizedFromApi);
    this.sesStorage.store('test', JSON.stringify(this.tokenizedFromApi));

    // and get the parsed version from back
    // this.textService
    //   .getParagraph()
    //   .then(res => {
    //     this.paragraph = res;

    //     //TODO these 2 should be onit, but causing problems, maybe because of this async call
    //     this.setGaps(20);
    //     this.countStatistics();
        
    //   });
    

  }

  gapToken(){
    this.gappedTokens = this.textService.gapService(this.tokenizedFromApi);
  }

  toggleText(token: Token): void {
    this.loggerService.log('click - ' + JSON.stringify(token));
    if(!this.showingOriginal){
      if(!token.isSpecial){
        token.isGap = !token.isGap
      }else{
        this.snackBar.open('cannot toggle gap when the token is special',null,{
          duration:2000,
        })      
      } ;
    }else{
      this.snackBar.open('cannot toggle gap while in Preview Mode',null,{
        duration:2000,
      })
    }

    this.countStatistics();
  }

  onSelect(token: Token): void {
    this.selectedToken = token;
    // this.selectedText.value[1] = 'apple';
    this.solutions = this.countSolutions(token);
  }

  updateGap(token: Token): void{
    this.gappedTokens[token.id] = this.textService.hideTextService(token.value,token.offset);
  }
  sliderInput(event: any){
    this.selectedToken.offset = event.value;
    this.updateGap(this.selectedToken);
  }

  goBack() {
    let dialogRef = this.dialog.open(TextEditDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if(res == 'Yes'){
        this.router.navigate(['/index']);
      };
    });
  }

  toggleSpecial(){
    this.selectedToken.isSpecial = !this.selectedToken.isSpecial;
  }

  //TODO not working
  reformat() {
    let dialogRef = this.dialog.open(ReformatDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      for(let i = 1; i < this.tokenizedFromApi.length; i++){
        this.tokenizedFromApi[i].isGap = false;
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


  countStatistics(){
      this.gapCount = 0;
      this.totalCount = 0;
      for(let i = 0; i < this.tokenizedFromApi.length; i++){
        this.totalCount++;
        if(this.tokenizedFromApi[i].isGap === true) this.gapCount++;
      }
  }

  toggleOriginal() {
    if(!this.showingOriginal){
      for(let i = 0; i < this.tokenizedFromApi.length; i++){
        this.currentGapsRecord.push( this.tokenizedFromApi[i].isGap);
        this.tokenizedFromApi[i].isGap = false;
      }
      this.showingOriginal = !this.showingOriginal;
    }else{
      for(let i = 0; i < this.tokenizedFromApi.length; i++){
        this.tokenizedFromApi[i].isGap = this.currentGapsRecord[i];
      }
      this.currentGapsRecord = [];  
      this.showingOriginal = !this.showingOriginal;    
    }
  }






  countSolutions(token: Token): string[]{
    let res: string[] = [];
    res.push(token.value);
    let i: number = 0;
    while(token.altValue[i] != null){
      res.push(token.altValue[i]);
      i++;
    }
    return res;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  //https://stackoverflow.com/questions/40314732/angular-2-2-way-binding-with-ngmodel-in-ngfor
  //it is used to bind ngmodel in a ngfor. without this it will lose focus on each keystroke.
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
    this.solutions.push('');
    // this.loggerService.log(this.paragraph[this.selectedText.id].value);
    this.countStatistics();
  }


  deleteSolution(id: number):void{

    if(id == 0 ){
      if(this.selectedToken.altValue.length >= 1){
        this.selectedToken.value = this.selectedToken.altValue[0];
        this.selectedToken.altValue.splice(0, 1);
        this.solutions.splice(id, 1);
      }else{
        this.snackBar.open('Can not delete the only solution!',null,{
          duration:2000,
        })
      }
    }else{
      this.selectedToken.altValue.splice(id - 1, 1);
      this.solutions.splice(id, 1);
    }
    this.countStatistics();
  }

  solution2Token(){
    this.selectedToken.value = this.solutions[0];
    let i: number = 0;
    while(this.solutions[i + 1] != null){
      this.selectedToken.altValue[i] = this.solutions[i + 1];
      i++;
    }
    this.updateGap(this.selectedToken);
  }

  add(newText: string, id: number): void{
      if(newText == null) return;
      this.loggerService.log('add ' + JSON.stringify(newText)  );
      let altValue: string[] = [];
      let newToken = {
            id: id + 1,
            value: newText,
            altValue: altValue,
            offset: 3,
            isGap: false,
            isSpecial: false
      };
      this.tokenizedFromApi.splice(id + 1, 0, newToken);
      this.updateTextIds();
      this.simpleDrop = -1;
      this.addedText = '';
      this.selectedToken = null;
      this.countStatistics();
  }//TODO when adding a new word, the bug still exists of setting wrong index: when double click it toggles the previous one, when add, its adds to next index

  onDropSuccess(id: any){
    this.loggerService.log(id);
    this.simpleDrop = id;
  }

  onDeleteDropSuccess($event: any){
    this.tokenizedFromApi.splice($event.dragData,1);
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
    for (let i = 0; i < this.tokenizedFromApi.length; i++) {
      this.tokenizedFromApi[i].id = i;
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe();
  }

  debug(){
    console.log('%%tokens from API %%',this.tokenizedFromApi);
    this.snackBar.open('haha');
    console.log('solutions',this.solutions);


  }
}


import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef ,MD_DIALOG_DATA} from '@angular/material';
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent implements OnInit {


  constructor(public dialogRef: MdDialogRef<ExportDialogComponent>, 
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }


  formatSelected : string = 'json';
  title = 'C-TEST';

  formats = [
    {value: 'json', viewValue: 'json'},
    {value: 'txt', viewValue: 'txt'},
    {value: 'pdf', viewValue: 'pdf'}
  ];

  export(){

    console.log(this.formatSelected, this.title);

    switch(this.formatSelected) { 
      case 'json': { 
         this.export2json();
         break; 
      } 
      case 'txt': { 
         this.export2txt();
         break; 
      } 
      case 'pdf': { 
        this.export2pdf();
        break; 
     } 
      default: { 
         //statements; 
         break; 
      } 
   } 
  }




  export2json(): any{

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(this.data.json));
    element.setAttribute('download', this.title + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


  export2txt(): any {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.data.json));
    element.setAttribute('download', this.title + '.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  export2pdf(): any {
    //https://stackoverflow.com/a/41499623/3621975
    var doc = new jsPDF();
    doc.text(this.data.json, 10, 10);
    doc.save(this.title + '.pdf');
  }

}

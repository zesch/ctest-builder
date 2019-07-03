import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CtestService } from '../../services/ctest.service';
import { MatSnackBar } from '@angular/material';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'tp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /**
   * The form containing the text to send to the service.
   */
  public form: FormGroup;

  /** holds value indicate if user uploaded wrong files or not */
  public invalidType = false;

  /** holds available system languages */
  public languages = [
    { value: 'en', viewValue: 'English' },
    { value: 'fr', viewValue: 'French' },
    { value: 'de', viewValue: 'German' },
    { value: 'fi', viewValue: 'Finnish' },
    { value: 'es', viewValue: 'Spanish' },
    { value: 'it', viewValue: 'Italian' }
  ];

  /**
   * Indicates whether the c-test service is available.
   */
  public serviceAvailable: boolean;

  /**
   * The title of the c-test.
   */
  public title: string;

  // Life Cycle Hooks
  constructor(
    private _fb: FormBuilder,
    private ctestService: CtestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      ctestTitle: ['', Validators.required],
      ctestText: ['', Validators.required],
    });

    this.ctestService.verify().subscribe(
      success => {
        console.log(success);
        this.serviceAvailable = true;
      },
      failure => {
        console.error('GapScheme Service is not available.');
        this.serviceAvailable = false;
        this.snackBar.open('GapScheme Service is not available.', 'OK');
      }
    );
  }

  /**
   * when user selects a txt file
   * @param  {event} Event holds value of event that holds HTMLInputElement
   */
  public load($event) {
    const input = $event.target as HTMLInputElement;
    // Validate the input is in .txt format
    if (/(\.txt|\.TXT)$/.test(input.value)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.title = this.fileNameToTitle(input.files[0].name.split('.')[0]);
        this.form.controls.ctestText.setValue(reader.result);
      };
      reader.readAsText(input.files[0]);
      this.invalidType = false;
    } else {
      this.invalidType = true;
      this.form.controls.ctestText.reset('');
    }
  }

  /**
   * Imports a c-test from file.
   */
  public import($event) {
    const input = $event.target as HTMLInputElement;
    const reader = new FileReader();
    reader.onloadstart = () => {
      this.snackBar.open('Importing C-Test...', 'OK');
    }
    reader.onload = () => {
      const fileName = input.files[0].name;
      this.title = this.fileNameToTitle(fileName.split('.')[0]);
      this.ctestService.setTitle(this.title);
      const text = reader.result as string;
      console.log(text);
      if (fileName.endsWith('.ctest.json')) {
        const ctest = JSON.parse(text);
        this.ctestService.setCTest(ctest);
        this.snackBar.open('Done!', 'OK', {duration: 1250});
        this.router.navigate(['/text-editor']);
      } else { // endsWith(.xml)
        this.ctestService.fetchCTestFromJACK(text).subscribe(
          success => {
            this.snackBar.open('Done!', 'OK', {duration: 1250});
            this.router.navigate(['/text-editor']);
          },
          failure => this.snackBar.open('ERROR: Could not reimport C-Test.', 'OK'));
      }
    };
    reader.readAsText(input.files[0]);
  }

  private fileNameToTitle(fileName: string) {
    return fileName.replace(/_/g, ' ');
  }

  /**
   * Submits the form, requests the C-Test and navigates to the text-edit view.
   */
  public submit() {
    if (this.form.valid && this.serviceAvailable) {
      this.snackBar.open('Processing text, please be patient...', 'OK');

      this.ctestService.setTitle(this.title);
      const text = this.form.controls.ctestText.value;
      this.ctestService.identifyLanguage(text).pipe(
        switchMap(language => this.ctestService.fetchCTest(text, language))
      ).subscribe(
        success => {
          this.snackBar.open('Done!', 'OK', {duration: 1250});
          this.router.navigate(['/text-editor']);
        },
        failure => {
          this.snackBar.open('ERROR: Could not process text!', 'OK', {duration: 2500});
        }
      );
    }
  }
}

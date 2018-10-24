import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CtestService } from '../ctest.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';
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

  private serviceAvailable: boolean;

  // Life Cycle Hooks
  constructor(
    private _fb: FormBuilder,
    private ctestService: CtestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
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
  load($event) {
    const input = $event.target as HTMLInputElement;
    // Validate the input is in .txt format
    if (/(\.txt|\.TXT)$/.test(input.value)) {
      const reader = new FileReader();
      reader.onload = () => {
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
   * Submits the form, requests the C-Test and navigates to the text-edit view.
   */
  submit() {
    if (this.form.valid && this.serviceAvailable) {
      this.snackBar.open('Processing text, please be patient...', 'OK');

      let text = this.form.controls.ctestText.value;

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

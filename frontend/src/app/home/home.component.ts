import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CtestService } from '../ctest.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';

@Component({
  selector: 'tp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Variables
  public form: FormGroup;

  /** holds current selected tab index*/
  public selectedIndex = 0;

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
      language: ['', Validators.required],
      textToTranslate: ['', Validators.required],
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
        this.form.controls.textToTranslate.setValue(reader.result);
      };
      reader.readAsText(input.files[0]);
      this.invalidType = false;
      this.selectedIndex = 0;
    } else {
      this.invalidType = true;
      this.form.controls.textToTranslate.reset('');
    }
  }

  /**
   * Event Fires when user navigate between tabs
   * @param {number} val  holds selected tab index
   */
  selectedIndexChange(val: number) {
    this.selectedIndex = val;
  }

  /**
   * submitting form and navigating to next stage
   */
  submit() {
    if (this.form.valid && this.serviceAvailable) {
      this.snackBar.open('Processing text, please be patient...', 'OK');

      this.ctestService.fetchCTest(this.form.controls.textToTranslate.value, this.form.controls.language.value).subscribe(
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

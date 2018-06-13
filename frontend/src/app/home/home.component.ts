import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from './../storage.service';
import { LOCAL_STORAGE } from '../../shared/utilities/defines';
import { Router } from '@angular/router';

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
    { value: 'english-0', viewValue: 'English' },
    { value: 'french-1', viewValue: 'French' },
    { value: 'german-2', viewValue: 'German' }
  ];

  // Life Cycle Hooks
  constructor(private _fb: FormBuilder, private storageService: StorageService,private router:Router) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      language: ['', Validators.required],
      textToTranslate: ['', Validators.required],
    });
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
    if (this.form.valid) {
      this.storageService.setStorage(LOCAL_STORAGE.Language, this.form.controls.language.value);
      this.storageService.setStorage(LOCAL_STORAGE.TEXT, this.form.controls.textToTranslate.value);
      this.router.navigate(['/text-editor']);
    }
  }
}

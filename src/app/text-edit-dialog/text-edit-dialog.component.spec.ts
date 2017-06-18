import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditDialogComponent } from './text-edit-dialog.component';

describe('TextEditDialogComponent', () => {
  let component: TextEditDialogComponent;
  let fixture: ComponentFixture<TextEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

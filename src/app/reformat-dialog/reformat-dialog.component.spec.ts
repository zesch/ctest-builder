import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReformatDialogComponent } from './reformat-dialog.component';

describe('ReformatDialogComponent', () => {
  let component: ReformatDialogComponent;
  let fixture: ComponentFixture<ReformatDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReformatDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReformatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadActComponent } from './upload-act.component';

describe('UploadActComponent', () => {
  let component: UploadActComponent;
  let fixture: ComponentFixture<UploadActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

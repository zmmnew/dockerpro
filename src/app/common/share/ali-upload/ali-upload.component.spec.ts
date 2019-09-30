import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AliUploadComponent } from './upload-ali.component';

describe('UploadAliComponent', () => {
  let component: AliUploadComponent;
  let fixture: ComponentFixture<AliUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AliUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

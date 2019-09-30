import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontUploadComponent } from './front-upload.component';

describe('FrontUploadComponent', () => {
  let component: FrontUploadComponent;
  let fixture: ComponentFixture<FrontUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

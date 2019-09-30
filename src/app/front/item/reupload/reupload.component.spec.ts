import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuploadComponent } from './reupload.component';

describe('ReuploadComponent', () => {
  let component: ReuploadComponent;
  let fixture: ComponentFixture<ReuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

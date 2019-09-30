import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineActComponent } from './online-act.component';

describe('OnlineActComponent', () => {
  let component: OnlineActComponent;
  let fixture: ComponentFixture<OnlineActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

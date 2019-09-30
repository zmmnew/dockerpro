import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupNumComponent } from './signup-num.component';

describe('SignupNumComponent', () => {
  let component: SignupNumComponent;
  let fixture: ComponentFixture<SignupNumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupNumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

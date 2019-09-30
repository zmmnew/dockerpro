import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontUserComponent } from './front-user.component';

describe('FrontUserComponent', () => {
  let component: FrontUserComponent;
  let fixture: ComponentFixture<FrontUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

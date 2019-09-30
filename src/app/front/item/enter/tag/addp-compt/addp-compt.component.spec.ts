import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpComptComponent } from './addp-compt.component';

describe('AddpComptComponent', () => {
  let component: AddpComptComponent;
  let fixture: ComponentFixture<AddpComptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpComptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpComptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

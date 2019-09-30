import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddZuopinComponent } from './add-zuopin.component';

describe('AddZuopinComponent', () => {
  let component: AddZuopinComponent;
  let fixture: ComponentFixture<AddZuopinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddZuopinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddZuopinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

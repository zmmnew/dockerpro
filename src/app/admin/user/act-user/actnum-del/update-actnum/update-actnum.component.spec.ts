import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateActnumComponent } from './update-actnum.component';

describe('UpdateActnumComponent', () => {
  let component: UpdateActnumComponent;
  let fixture: ComponentFixture<UpdateActnumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateActnumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateActnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

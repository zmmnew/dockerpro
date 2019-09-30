import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActnumDelComponent } from './actnum-del.component';

describe('ActnumDelComponent', () => {
  let component: ActnumDelComponent;
  let fixture: ComponentFixture<ActnumDelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActnumDelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActnumDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

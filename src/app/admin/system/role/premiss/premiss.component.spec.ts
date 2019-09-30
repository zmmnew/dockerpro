import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremissComponent } from './premiss.component';

describe('PremissComponent', () => {
  let component: PremissComponent;
  let fixture: ComponentFixture<PremissComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremissComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

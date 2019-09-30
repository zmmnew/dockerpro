import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSetComponent } from './update-set.component';

describe('UpdateSetComponent', () => {
  let component: UpdateSetComponent;
  let fixture: ComponentFixture<UpdateSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

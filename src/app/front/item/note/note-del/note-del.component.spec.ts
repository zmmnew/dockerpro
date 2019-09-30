import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDelComponent } from './note-del.component';

describe('NoteDelComponent', () => {
  let component: NoteDelComponent;
  let fixture: ComponentFixture<NoteDelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteDelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

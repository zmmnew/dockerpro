import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubDelComponent } from './pub-del.component';

describe('PubDelComponent', () => {
  let component: PubDelComponent;
  let fixture: ComponentFixture<PubDelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubDelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

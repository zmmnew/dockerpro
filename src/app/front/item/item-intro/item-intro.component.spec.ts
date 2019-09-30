import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemIntroComponent } from './item-intro.component';

describe('ItemIntroComponent', () => {
  let component: ItemIntroComponent;
  let fixture: ComponentFixture<ItemIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

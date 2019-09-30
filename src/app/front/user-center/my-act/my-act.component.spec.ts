import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActComponent } from './my-act.component';

describe('MyActComponent', () => {
  let component: MyActComponent;
  let fixture: ComponentFixture<MyActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

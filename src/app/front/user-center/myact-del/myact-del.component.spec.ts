import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyactDelComponent } from './myact-del.component';

describe('MyactDelComponent', () => {
  let component: MyactDelComponent;
  let fixture: ComponentFixture<MyactDelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyactDelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyactDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

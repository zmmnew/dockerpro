import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZhinanComponent } from './zhinan.component';

describe('ZhinanComponent', () => {
  let component: ZhinanComponent;
  let fixture: ComponentFixture<ZhinanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZhinanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhinanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

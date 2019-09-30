import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AliVideoplayComponent } from './ali-videoplay.component';

describe('AliVideoplayComponent', () => {
  let component: AliVideoplayComponent;
  let fixture: ComponentFixture<AliVideoplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliVideoplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AliVideoplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

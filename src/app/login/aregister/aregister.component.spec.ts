import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AregisterComponent } from './aregister.component';

describe('AregisterComponent', () => {
  let component: AregisterComponent;
  let fixture: ComponentFixture<AregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

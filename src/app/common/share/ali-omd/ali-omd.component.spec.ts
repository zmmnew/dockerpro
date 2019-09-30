import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AliOmdComponent } from './ali-omd.component';

describe('AliOmdComponent', () => {
  let component: AliOmdComponent;
  let fixture: ComponentFixture<AliOmdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliOmdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AliOmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

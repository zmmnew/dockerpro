import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnAddComponent } from './ann-add.component';

describe('AnnAddComponent', () => {
  let component: AnnAddComponent;
  let fixture: ComponentFixture<AnnAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

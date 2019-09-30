import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActApplyComponent } from './act-apply.component';

describe('ActApplyComponent', () => {
  let component: ActApplyComponent;
  let fixture: ComponentFixture<ActApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

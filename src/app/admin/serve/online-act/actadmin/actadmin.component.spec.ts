import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActadminComponent } from './actadmin.component';

describe('ActadminComponent', () => {
  let component: ActadminComponent;
  let fixture: ComponentFixture<ActadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

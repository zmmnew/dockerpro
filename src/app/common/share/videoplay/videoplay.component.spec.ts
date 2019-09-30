import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoplayComponent } from './videoplay.component';

describe('VideoplayComponent', () => {
  let component: VideoplayComponent;
  let fixture: ComponentFixture<VideoplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

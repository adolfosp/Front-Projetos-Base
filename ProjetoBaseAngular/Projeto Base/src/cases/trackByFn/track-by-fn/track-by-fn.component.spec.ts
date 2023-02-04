import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackByFnComponent } from './track-by-fn.component';

describe('TrackByFnComponent', () => {
  let component: TrackByFnComponent;
  let fixture: ComponentFixture<TrackByFnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackByFnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackByFnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkReportsComponent } from './work-reports.component';

describe('WorkReportsComponent', () => {
  let component: WorkReportsComponent;
  let fixture: ComponentFixture<WorkReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

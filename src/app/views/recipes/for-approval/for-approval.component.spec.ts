import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForApprovalComponent } from './for-approval.component';

describe('ForApprovalComponent', () => {
  let component: ForApprovalComponent;
  let fixture: ComponentFixture<ForApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

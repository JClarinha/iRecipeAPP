import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRecipesComponent } from './approved-recipes.component';

describe('ApprovedRecipesComponent', () => {
  let component: ApprovedRecipesComponent;
  let fixture: ComponentFixture<ApprovedRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedRecipesComponent } from './rejected-recipes.component';

describe('RejectedRecipesComponent', () => {
  let component: RejectedRecipesComponent;
  let fixture: ComponentFixture<RejectedRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

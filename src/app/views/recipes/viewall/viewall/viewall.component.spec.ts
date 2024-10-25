/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewallComponent } from './viewall.component';
import { AuthService } from 'src/services/auth.service';
import { RecipeService } from 'src/services/recipe.Service';
import { CategoryService } from 'src/services/category.Service';
import { DifficultyService } from 'src/services/difficulty.Service';
import { Router } from '@angular/router';
import { of } from 'rxjs';  


class MockAuthService {
  getCurrentUser() {
    return { id: 1, name: 'Test User' }; 
  }
}

class MockRecipeService {
  getByUserId(userId: number) {
    return of([  
      { id: 1, name: 'Test Recipe 1', imagePath: null, categoryId: 1, difficultyId: 1, userId: 1, recipeDate: new Date(), approval: true },
      { id: 2, name: 'Test Recipe 2', imagePath: '/test-path.jpg', categoryId: 2, difficultyId: 2, userId: 1, recipeDate: new Date(), approval: false }
    ]);
  }

  getImageUrl(imagePath: string) {
    return of(`/mock-url/${imagePath}`); 
  }
}

class MockCategoryService {
  getById(categoryId: number) {
    return of({ id: categoryId, name: 'Test Category' }); 
  }
}

class MockDifficultyService {
  getById(difficultyId: number) {
    return of({ id: difficultyId, difficultyLevel: 'Easy' }); 
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate'); 
}

describe('ViewallComponent', () => {
  let component: ViewallComponent;
  let fixture: ComponentFixture<ViewallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewallComponent],  
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: CategoryService, useClass: MockCategoryService },
        { provide: DifficultyService, useClass: MockDifficultyService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should get current user on init', () => {
    expect(component.currentUser).toEqual({ id: 1, name: 'Test User' });
    expect(component.userId).toBe(1);
  });

  fit('should load recipes on init', () => {
    expect(component.recipes.length).toBe(2);
    expect(component.recipes[0].name).toBe('Test Recipe 2'); 
  });

  fit('should navigate to recipe details when goToRecipeDetails is called', () => {
    const router = TestBed.inject(Router);
    
    
    const recipe = {
      id: 1,
      name: 'Test Recipe 1',
      pax: 4,
      description: 'Test Description',
      categoryId: 1,
      duration: 30,
      recipeDate: new Date(),
      userId: 1,
      approval: true,
      imagePath: '',
      difficultyId: 1,
      preparation: 'Step-by-step instructions',
      category: { id: 1, name: 'Test Category' },
      difficulty: { id: 1, difficultyLevel: 'Easy' },
      user: { id: 1, name: 'Test User', email: 'teste@teste.com', password: '', admin: false }
    };

    component.goToRecipeDetails(recipe);

    expect(router.navigate).toHaveBeenCalledWith(['/recipe/recipe-details'], { state: { recipe } });
  });
});

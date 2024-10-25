import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from 'src/services/recipe.Service';
import { AuthService } from 'src/services/auth.service'; // Import do serviço de autenticação
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryService } from 'src/services/category.Service';
import { Recipe } from 'src/models/recipe';
import { DifficultyService } from 'src/services/difficulty.Service';

@Component({
  selector: 'app-approved-recipes',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, FormsModule],
  templateUrl: './approved-recipes.component.html',
  styleUrl: './approved-recipes.component.scss'
})
export class ApprovedRecipesComponent {
  recipes: Recipe[] = []; 
  currentUser: any;
  userId!: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService,
    private recipeService: RecipeService,
    private difficultyService: DifficultyService,

  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userId = this.currentUser.id;
    }
    this.getAll();
  }
  
  getAll() {
    this.recipeService.getAll().subscribe((response: Recipe[]) => {
        this.recipes = response.filter(recipe => recipe.approval === true);

         // Inverte a ordem das receitas
         this.recipes.reverse();

        this.recipes.forEach(recipe => {

              // Verifica se imagePath está definido
              if (recipe.imagePath) {
                const filename = recipe.imagePath; // Atribui o valor de imagePath

                this.recipeService.getImageUrl(filename).subscribe(url => {
                    recipe.imagePath = url; // Atribui a URL da imagem
                });
            } else {
                
                recipe.imagePath = '/assets/images/Image_not_available.png'; 
            }

            
            if (recipe.categoryId) {
                this.categoryService.getById(recipe.categoryId).subscribe(category => {
                    recipe.category = category; 
                });
            }

            
            if (recipe.difficultyId) {
                this.difficultyService.getById(recipe.difficultyId).subscribe(difficulty => {
                    recipe.difficulty = difficulty; 
                });
            }

             
            if (recipe.userId) {
              this.authService.getById(recipe.userId).subscribe(user => {
                recipe.user = user; 
                console.log("User ID ", recipe.user)
              });
            }
          });
    });
}


  goToApprovalDetails(recipe: Recipe): void {
    this.router.navigate(['/recipe/approvalDetail'], { state: { recipe } });
  }
}
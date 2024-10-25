import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { CategoryService } from 'src/services/category.Service';
import { RecipeService } from 'src/services/recipe.Service';
import { Recipe } from 'src/models/recipe';
import { DifficultyService } from 'src/services/difficulty.Service';


import { Difficulty } from 'src/models/difficulty';
import { User } from 'src/models/user';
import { Category } from 'src/models/category';

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrls: ['./viewall.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ViewallComponent implements OnInit {
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
    this.getByUserId();
  }
  
  getByUserId() {
    this.recipeService.getByUserId(this.userId).subscribe((response: Recipe[]) => {
        this.recipes = response;

         
         this.recipes.reverse();

        this.recipes.forEach(recipe => {

              
              if (recipe.imagePath) {
                const filename = recipe.imagePath; 

                this.recipeService.getImageUrl(filename).subscribe(url => {
                    recipe.imagePath = url; 
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


  goToRecipeDetails(recipe: Recipe): void {
    this.router.navigate(['/recipe/recipe-details'], { state: { recipe } });
  }
}

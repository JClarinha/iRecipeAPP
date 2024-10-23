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
  recipes: Recipe[] = []; // Lista de todas as receitas
  currentUser: number = 1;


  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService,
    private recipeService: RecipeService,
    private difficultyService: DifficultyService,

  ) {}

  ngOnInit(): void {
    this.getByUserId();
  }
  
  getByUserId() {
    this.recipeService.getByUserId(this.currentUser).subscribe((response: Recipe[]) => {
        this.recipes = response;

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
                // Se não houver imagePath, pode atribuir uma imagem padrão ou fazer outra lógica
                recipe.imagePath = '/assets/images/Image_not_available.png'; // Imagem padrão
            }

            // Buscar categorias
            if (recipe.categoryId) {
                this.categoryService.getById(recipe.categoryId).subscribe(category => {
                    recipe.category = category; // Atribui a dificuldade à receita
                });
            }

            // Buscar dificuldade
            if (recipe.difficultyId) {
                this.difficultyService.getById(recipe.difficultyId).subscribe(difficulty => {
                    recipe.difficulty = difficulty; // Atribui a dificuldade à receita
                });
            }

             // Verifica se a receita tem um userId e busca o usuário
            if (recipe.userId) {
              this.authService.getById(recipe.userId).subscribe(user => {
                recipe.user = user; // Atribui o usuário à receita
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

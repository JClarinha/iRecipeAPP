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
  selector: 'app-forApproval',
  templateUrl: './for-approval.component.html',
  styleUrls: ['./for-approval.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ForApprovalComponent implements OnInit {
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
        this.recipes = response.filter(recipe => recipe.approval === null);

        
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


  goToApprovalDetails(recipe: Recipe): void {
    this.router.navigate(['/recipe/approvalDetail'], { state: { recipe } });
  }
}

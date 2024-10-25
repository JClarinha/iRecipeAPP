import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IngredientRecipe } from 'src/models/ingredientRecipe';
import { IngredientRecipeService } from 'src/services/ingredientRecipe.Service';
import { RecipeService } from 'src/services/recipe.Service';
import { AuthService } from 'src/services/auth.service';  // Import do serviço de autenticação

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
  encapsulation: ViewEncapsulation.None,  
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule] 
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;
  ingredients: IngredientRecipe[] = [];
  currentUser: any;

  constructor(
    private router: Router, 
    private location: Location, 
    private ingredientRecipeService: IngredientRecipeService, 
    private recipeService: RecipeService,
    private authService: AuthService  
  ) {}

  ngOnInit(): void {
    // Carrega o utilizador atual
    this.currentUser = this.authService.getCurrentUser();

    if (history.state && history.state.recipe) {
      this.recipe = history.state.recipe;
      this.getIngredientsByRecipeId(this.recipe.id);
    } else {
      this.router.navigate(['/recipe/viewall']); // Redireciona se não houver receita
    }
  }

  getIngredientsByRecipeId(recipeId: number): void {
    this.ingredientRecipeService.getByRecipeId(recipeId).subscribe(ingredients => {
      this.ingredients = ingredients; 
    });
  }

  formatPreparationMethod(preparation: string): string[] {
    // Divide a preparação em partes e mantém a pontuação no final
    const stepsWithPunctuation = preparation.split(/(?<=[.!;])\s*/); // Divide mantendo a pontuação
    return stepsWithPunctuation.map(step => step.trim()).filter(step => step); // Remove espaços
  }

  goBack() {
    this.location.back(); // Método para voltar à página anterior
  }

  // Função para verificar se o utilizador atual é o criador da receita
  isCurrentUserCreator(): boolean {
    return this.recipe && this.recipe.userId === this.currentUser.id;
  }

  deleteRecipe() {
    if (this.recipe && this.recipe.id) { // Verifica se a receita existe e se o ID é válido
        console.log(this.recipe.id); 
        this.recipeService.delete(this.recipe.id).subscribe({
            next: () => {
                console.log('Recipe deleted successfully.');
                this.router.navigate(['/recipe/viewall']); // Redireciona para a lista de receitas
            },
            error: (error) => {
                console.error('Error deleting recipe', error);
            }
        });
    } else {
        console.error('No recipe found to delete.');
    }
  }
}

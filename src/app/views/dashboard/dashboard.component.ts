import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';

import { faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { RecipeService } from 'src/services/recipe.Service';
import { Recipe } from 'src/models/recipe';
import { CategoryService } from 'src/services/category.Service';
import { DifficultyService } from 'src/services/difficulty.Service';
import { IngredientRecipe } from 'src/models/ingredientRecipe';
import { IngredientRecipeService } from 'src/services/ingredientRecipe.Service';
import { FavouriteService } from 'src/services/favourite.Service'; 
import { Favourite } from 'src/models/favourite'; 
import { CommentService } from 'src/services/comment.Service'; 
import { Comment } from 'src/models/comment'; 


@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule]
})

export class DashboardComponent implements OnInit {
  faStarSolid = faStarSolid;
  faStarOutline = faStarOutline;
  faTrash = faTrash;
  faTrashCan = faTrashCan;

  userFavourites: Favourite[] = []; 
  recipes: Recipe[] = [];
  ingredients: IngredientRecipe[] = [];
  newComment: { [key: number]: string } = {}; // Para armazenar os comentários por receita
  commentsByRecipe: { [key: number]: Comment[] } = {}; // Para armazenar comentários por receita
  userId!: number;
  isAdmin: boolean = false; // Variável para armazenar se o usuário é admin

  
  constructor(
    private authService: AuthService,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private difficultyService: DifficultyService,
    private ingredientRecipeService: IngredientRecipeService,
    private favouriteService: FavouriteService, 
    private commentService: CommentService, 
    private router: Router,
    private cdr: ChangeDetectorRef // Injetar ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllRecipes(); 
    this.loadUserFavourites(); 
    this.setUserIdAndAdmin(); // Adicionar chamada para verificar se é admin
  }

  // Carregar os favoritos do utilizador atual
  loadUserFavourites(): void {
    const currentUser = this.authService.getCurrentUser(); 
    this.userId = currentUser.id;
    this.isAdmin = currentUser.admin; // Define se o usuário é administrador
    this.favouriteService.getAllByUserId(this.userId).subscribe(favourites => {
      this.userFavourites = favourites; 
    });
  }

   // Configura o ID e verifica se o usuário é admin
   setUserIdAndAdmin(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser.id;
    this.isAdmin = currentUser.admin;
  }

  // Verifica se a receita está nos favoritos
  isRecipeFavourite(recipeId: number): boolean {
    return this.userFavourites.some(fav => fav.recipeId === recipeId);
  }

  // Alterna o estado de favorito para uma receita
  toggleFavourite(recipe: Recipe): void {
    const favourite = this.userFavourites.find(fav => fav.recipeId === recipe.id);

    if (favourite) {
      this.favouriteService.delete(favourite.id).subscribe(() => {
        this.userFavourites = this.userFavourites.filter(fav => fav.recipeId !== recipe.id);
      });
    } else {
      const formData = new FormData();
      formData.append('userId', this.userId.toString());
      formData.append('recipeId', recipe.id.toString());

      this.favouriteService.save(formData).subscribe(() => {
        this.loadUserFavourites();
      });
    }
  }

  // Carrega todas as receitas e os comentários
  getAllRecipes() {
    this.recipeService.getAll().subscribe((response: Recipe[]) => {
    // Filtra as receitas onde a propriedade 'approval' é true
    this.recipes = response.filter(recipe => recipe.approval === true); 
    this.recipes.reverse();
  
      this.recipes.forEach(recipe => {
        this.ingredientRecipeService.getByRecipeId(recipe.id).subscribe(ingredients => {
          recipe.ingredients = ingredients;
        });
  
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
          });
        }
  
        // Carregar comentários da receita e buscar o user de cada comentário
        this.commentService.getAll().subscribe(comments => {
          this.commentsByRecipe[recipe.id] = comments.filter(comment => comment.recipeId === recipe.id);
          
          // Para cada comentário, buscar o usuário pelo userId
          this.commentsByRecipe[recipe.id].forEach(comment => {
            this.authService.getById(comment.userId).subscribe(user => {
              comment.user = user; // Associar o usuário ao comentário
            });
          });
        });
      });
    });
  }
  

  // Adicionar comentário a uma receita com FormData
addComment(recipeId: number): void {
  const formData = new FormData();
  formData.append('recipeId', recipeId.toString());
  formData.append('userId', this.userId.toString());
  formData.append('description', this.newComment[recipeId] || '');

  // Enviar o FormData ao serviço de comentário
  this.commentService.save(formData).subscribe(() => {
    const currentUser = this.authService.getCurrentUser(); // Buscar o usuário atual
    const newComment: Comment = {
          id: 0,
          recipeId: recipeId,
          userId: this.userId,
          description: this.newComment[recipeId],
          user: currentUser // Associar o currentUser ao comentário
      };

      // Atualiza a lista de comentários localmente
      this.commentsByRecipe[recipeId] = this.commentsByRecipe[recipeId] || [];
      this.commentsByRecipe[recipeId].push(newComment);
      this.newComment[recipeId] = ''; // Limpa o campo de comentário após o envio
      this.cdr.detectChanges(); // Forçar detecção de mudanças

  });
}

// Excluir comentário
deleteComment(commentId: number, recipeId: number): void {
  this.commentService.delete(commentId).subscribe(() => {
    this.commentsByRecipe[recipeId] = this.commentsByRecipe[recipeId].filter(comment => comment.id !== commentId);
  });
}


  // Formatar método de preparação
  formatPreparationMethod(preparation: string): string[] {
    const stepsWithPunctuation = preparation.split(/(?<=[.!;])\s*/);
    return stepsWithPunctuation.map(step => step.trim()).filter(step => step);
  }

  // Navegar para os detalhes da receita
  goToRecipeDetails(recipe: Recipe): void {
    this.router.navigate(['/recipe/recipe-details'], { state: { recipe } });
  }
}

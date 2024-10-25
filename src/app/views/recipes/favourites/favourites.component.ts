import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'; // Ícone de estrela sólida
import { FavouriteService } from 'src/services/favourite.Service'; 
import { Favourite } from 'src/models/favourite'; // Modelo de Favoritos
import { AuthService } from 'src/services/auth.service'; // Serviço de autenticação
import { RecipeService } from 'src/services/recipe.Service'; // Serviço de Receitas
import { CategoryService } from 'src/services/category.Service'; 
import { DifficultyService } from 'src/services/difficulty.Service'; 
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class FavouritesComponent implements OnInit {
  favourites: Favourite[] = []; // Lista de favoritos
  currentUser: any;
  userId!: number;
  faStarSolid = faStarSolid;

  constructor(
    private router: Router,
    private authService: AuthService,
    private favouriteService: FavouriteService, 
    private recipeService: RecipeService, 
    private categoryService: CategoryService, 
    private difficultyService: DifficultyService 
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userId = this.currentUser.id;
      this.loadFavourites();
    }
  }

  // Função para carregar os favoritos do utilizador
  loadFavourites(): void {
    this.favouriteService.getAllByUserId(this.userId).subscribe((favourites: Favourite[]) => {
      this.favourites = favourites;
      this.favourites.forEach(fav => {
        // Verificar se há imagem associada
        if (fav.recipe?.imagePath) {
          this.recipeService.getImageUrl(fav.recipe.imagePath).subscribe(url => {
            fav.recipe!.imagePath = url;
          });
        } else {
          fav.recipe!.imagePath = '/assets/images/Image_not_available.png';
        }

        // Buscar categorias
        if (fav.recipe?.categoryId) {
          this.categoryService.getById(fav.recipe.categoryId).subscribe(category => {
            fav.recipe!.category = category;
          });
        }

        // Buscar dificuldades
        if (fav.recipe?.difficultyId) {
          this.difficultyService.getById(fav.recipe.difficultyId).subscribe(difficulty => {
            fav.recipe!.difficulty = difficulty;
          });
        }

        // Buscar o usuário que criou a receita
        if (fav.recipe?.userId) {
          this.authService.getById(fav.recipe.userId).subscribe(user => {
            fav.recipe!.user = user;
          });
        }
      });
    });
  }

  // Função para remover o favorito
  toggleFavourite(fav: Favourite): void {
    this.favouriteService.delete(fav.id).subscribe(() => {
      this.favourites = this.favourites.filter(f => f.id !== fav.id); // Remove da lista
    });
  }

  // Navegar para os detalhes da receita
  goToRecipeDetails(fav: Favourite): void {
    this.router.navigate(['/recipe/recipe-details'], { state: { recipe: fav.recipe } });
  }
}

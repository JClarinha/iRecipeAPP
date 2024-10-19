import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';




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

    recipes = [
      {
        image: 'assets/images/food.jpg',
        name: 'Classic Lasagna',
        description: 'Layers of al dente pasta, rich meat sauce, and creamy béchamel...',
        category: 'Meat',
        user: 'JohnDoe',
        isFavorite: false,
        comments: [
          { user: 'Jane', text: 'Looks delicious!' },
          { user: 'Bob', text: 'I tried it and it’s great!' }
        ]
      },
      {
        image: 'assets/images/salmon.webp',
        name: 'Grilled Salmon',
        description: 'Juicy grilled salmon fillet seasoned with lemon...',
        category: 'Fish',
        user: 'ChefAlex',
        isFavorite: false,
        comments: []
      }
    ];

    newComment: string = '';

    ngOnInit(): void {
      // Carrega as receitas de outros utilizadores
      this.loadRecipes();
    }

    loadRecipes(): void {
      // Aqui carregas as receitas de outros utilizadores, podes simular ou integrar com um serviço
    }

    toggleFavorite(recipe: any): void {
      recipe.isFavorite = !recipe.isFavorite;
    }

    addComment(recipe: any): void {
      if (this.newComment.trim() !== '') {
        recipe.comments.push({ user: 'JohnDoe', text: this.newComment });
        this.newComment = ''; // Limpa o campo de comentário
      }
    }

  }

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
  encapsulation: ViewEncapsulation.None,  // Adicione isso se não estiver presente
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule] // Adicione este import para usar o pipe 'date'
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    if (history.state && history.state.recipe) {
      this.recipe = history.state.recipe;
    } else {
      this.router.navigate(['/recipe/viewall']); // Redireciona se não houver receita
    }
  }

  goBack() {
    this.location.back() ; // Método para voltar à página anterior
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IngredientRecipe } from 'src/models/ingredientRecipe';
import { IngredientRecipeService } from 'src/services/ingredientRecipe.Service';
import { RecipeService } from 'src/services/recipe.Service';
import { AuthService } from 'src/services/auth.service'; // Import do serviço de autenticação
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Importa o ícone da seta
import { faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-approval-detail',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, FormsModule],
  templateUrl: './approval-detail.component.html',
  styleUrl: './approval-detail.component.scss',
})

export class ApprovalDetailComponent implements OnInit {
  recipe: any;
  ingredients: IngredientRecipe[] = [];
  currentUser: any;
  imageUrl: string | null = null; // Adiciona a variável para armazenar a URL da imagem
  faArrowLeft = faArrowLeft; // Adiciona o ícone da seta no component
  faTrash = faTrash;
  faTrashCan = faTrashCan;
  faPencilAlt = faPencilAlt;



  constructor(
    private router: Router,
    private location: Location,
    private ingredientRecipeService: IngredientRecipeService,
    private recipeService: RecipeService,
    private authService: AuthService // Injeção do serviço de autenticação
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  
    if (history.state && history.state.recipe) {
      this.recipe = history.state.recipe;
      this.getIngredientsByRecipeId(this.recipe.id);
      
      
    } else {
      this.router.navigate(['/recipe/forApproval']); 
    }
  }
  

  getIngredientsByRecipeId(recipeId: number): void {
    this.ingredientRecipeService
      .getByRecipeId(recipeId)
      .subscribe((ingredients) => {
        this.ingredients = ingredients; // Atribui os ingredientes obtidos
      });
  }

  formatPreparationMethod(preparation: string): string[] {
    // Divide a preparação em partes e mantém a pontuação no final
    const stepsWithPunctuation = preparation.split(/(?<=[.!;])\s*/); // Divide mantendo a pontuação
    return stepsWithPunctuation
      .map((step) => step.trim())
      .filter((step) => step); // Remove espaços
  }

  goBack() {
    this.location.back(); // Método para voltar à página anterior
  }

  // Função para verificar se o utilizador atual é o criador da receita
  isCurrentUserCreator(): boolean { 
    return this.recipe && (this.recipe.userId === this.currentUser.id || this.currentUser.admin === true);
  }

  deleteRecipe() {
    if (this.recipe && this.recipe.id) {
      // Exibir popup de confirmação
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Se o usuário confirmar, proceda com a exclusão
          this.recipeService.delete(this.recipe.id).subscribe({
            next: () => {
              Swal.fire(
                'Deleted!',
                'The recipe has been deleted.',
                'success'
              );
              this.router.navigate(['/recipe/forApproval']); // Redireciona para a lista de receitas
            },
            error: (error) => {
              console.error('Error deleting recipe', error);
            },
          });
        }
      });
    } else {
      console.error('No recipe found to delete.');
    }
  }
  

  createFormData(): FormData {
    const formData = new FormData();
    formData.append('id', this.recipe.id);
    formData.append('name', this.recipe.name);
    formData.append('description', this.recipe.description);
    formData.append('pax', this.recipe.pax.toString());
    formData.append('duration', this.recipe.duration.toString());
    formData.append('categoryId', this.recipe.categoryId.toString());
    formData.append('difficultyId', this.recipe.difficultyId.toString());
    formData.append('preparation', this.recipe.preparation);
    formData.append('approval', this.recipe.approval?.toString() || '');
    formData.append('userId', this.recipe.userId.toString());
    formData.append('recipeDate', this.recipe.recipeDate || '');
    formData.append('imagePath', this.recipe.imagePath);
    



    // Adiciona ingredientes ao FormData
    this.ingredients.forEach((ingredient, index) => {
      if (ingredient.ingredient) {
        formData.append(
          `ingredients[${index}][name]`,
          ingredient.ingredient.name
        );
      } else {
        console.error(`Ingrediente faltando no índice ${index}`);
      }

      formData.append(
        `ingredients[${index}][quantity]`,
        ingredient.quantity?.toString() || '0'
      );

      if (ingredient.unit) {
        formData.append(`ingredients[${index}][unit]`, ingredient.unit.name);
      } else {
        console.error(`Unidade faltando no índice ${index}`);
      }
    });

    return formData;
  }

  approveRecipe() {
    if (this.recipe && this.recipe.id) {
      // Exibir popup de confirmação
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to approve this recipe?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745', 
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Se confirmado, aprova a receita
          this.recipe.approval = true; // Atualiza o estado para aprovado
          
          const formData = this.createFormData();
          
          // Enviar a receita para atualização
          this.recipeService.update(formData).subscribe({
            next: (response) => {
              Swal.fire(
                'Approved!',
                'The recipe has been approved.',
                'success'
              );
              this.goBack();
            },
            error: (error) => {
              console.error('Error approving recipe', error);
            },
          });
        }
      });
    }
  }
  
  
  
  rejectRecipe() {
    if (this.recipe && this.recipe.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to reject this recipe?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reject it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Se confirmado, rejeita a receita
          this.recipe.approval = false; // Atualiza o estado para recusado
          const formData = this.createFormData();
          this.recipeService.update(formData).subscribe({
            next: () => {
              Swal.fire(
                'Rejected!',
                'The recipe has been rejected.',
                'success'
              );
              this.goBack();
            },
            error: (error) => {
              console.error('Error rejecting recipe', error);
            },
          });
        }
      });
    }
  }
  

  editRecipe() {
    // Navega para uma página de edição com os detalhes da receita
    this.router.navigate(['/recipe/edit', this.recipe.id]); // Redireciona para a página de edição
  }
}

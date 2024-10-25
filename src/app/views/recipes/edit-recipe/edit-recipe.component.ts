import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/services/category.Service';
import { DifficultyService } from 'src/services/difficulty.Service';
import { RecipeService } from 'src/services/recipe.Service';
import { IngredientRecipeService } from 'src/services/ingredientRecipe.Service';
import { UnitService } from 'src/services/unit.Service';
import { AuthService } from 'src/services/auth.service';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Recipe } from 'src/models/recipe';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IngredientRecipe } from 'src/models/ingredientRecipe';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, FormsModule]
})
export class EditRecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  categories: any[] = [];
  difficulties: any[] = [];
  units: any[] = [];
  recipeId!: number;
  faTrashCan = faTrashCan;
  currentUser: any;
  userId!: number;
  recipe!: Recipe; 


  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private difficultyService: DifficultyService,
    private ingredientRecipeService: IngredientRecipeService,
    private unitService: UnitService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.params['id'];
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userId = this.currentUser.id;
    }
    // Inicializa o formulário
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      preparation: ['', Validators.required],
      difficultyId: [null, Validators.required],
      duration: ['', Validators.required],
      pax: ['', Validators.required],
      user: [null, Validators.required],
      image: [null],
      categoryId: [null, Validators.required],
      ingredients: this.fb.array([], Validators.min(2)) // Mínimo de 2 ingredientes
      
    });

  
    // Carregar categorias, dificuldades, unidades e receita
    this.getCategories();
    this.getDifficulties();
    this.getUnits();
    this.loadRecipe();
  }

  // Função para carregar as categorias
  getCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Função para carregar dificuldades
  getDifficulties() {
    this.difficultyService.getAll().subscribe(difficulties => {
      this.difficulties = difficulties;
    });
  }

  // Função para carregar unidades
  getUnits() {
    this.unitService.getAll().subscribe(units => {
      this.units = units;
    });
  }

  // Função para carregar a receita para edição
  loadRecipe(): void {
    this.recipeService.getById(this.recipeId).subscribe((recipe: Recipe) => {
      this.recipe = recipe;

      if (recipe) {
        // Preencher o formulário com os dados da receita
        this.recipeForm.patchValue({
          name: recipe.name,
          description: recipe.description,
          preparation: recipe.preparation,
          difficultyId: recipe.difficultyId,
          duration: recipe.duration,
          pax: recipe.pax,
          categoryId: recipe.categoryId,
          user: recipe.user?.name
        });

      // Buscar o utilizador associado pelo recipe.userId
      if (recipe.userId) {
        this.authService.getById(recipe.userId).subscribe((user) => {
          if (user) {
            this.recipeForm.patchValue({ user: user.name });
          }
        });
      }
  
        // Buscar os ingredientes da receita na tabela IngredientRecipe
        this.ingredientRecipeService.getByRecipeId(this.recipeId).subscribe((ingredientRecipes: IngredientRecipe[]) => {
          this.setIngredientRecipes(ingredientRecipes);
        });

        
    if (this.recipe.imagePath) {
      this.recipeForm.patchValue({ imagePath: this.recipe.imagePath });
    }
      }
    });
  }
  


setIngredientRecipes(ingredientRecipes: IngredientRecipe[]): void {
  const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;

  ingredientRecipes.forEach((ingredientRecipe: IngredientRecipe) => {
    const ingredientGroup = this.fb.group({
      ingredientname: [ingredientRecipe.ingredient?.name, Validators.required], // Nome do ingrediente
      quantity: [ingredientRecipe.quantity, Validators.required], // Quantidade
      unitId: [ingredientRecipe.unitId, Validators.required] // Unidade associada
    });
    ingredientsArray.push(ingredientGroup);
  });
}



  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientGroup = this.fb.group({
      ingredientname: ['', Validators.required],
      quantity: ['', Validators.required],
      unitId: ['', Validators.required]
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // Função para o envio da atualização
updateRecipe() {
  if (this.recipeForm.valid) {
    // Exibir um popup de confirmação antes de proceder com a atualização
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to edit this recipe?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, edit it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('id', this.recipeId.toString()); // Adiciona o ID da receita
        formData.append('name', this.recipeForm.get('name')?.value);
        formData.append('description', this.recipeForm.get('description')?.value);
        formData.append('pax', this.recipeForm.get('pax')?.value);
        formData.append('categoryId', this.recipeForm.get('categoryId')?.value);
        formData.append('duration', this.recipeForm.get('duration')?.value);
        formData.append('preparation', this.recipeForm.get('preparation')?.value);
        formData.append('difficultyId', this.recipeForm.get('difficultyId')?.value);
        formData.append('userId', this.userId.toString());

        // Adicionar recipeDate (se disponível)
        if (this.recipe.recipeDate) {
          formData.append('recipeDate', this.recipe.recipeDate.toString());
        }

        // Adicionar imagePath (se disponível)
        if (this.recipe.imagePath) {
          formData.append('imagePath', this.recipe.imagePath);
        }

        // Adicionar ingredientes ao FormData
        const ingredients = this.recipeForm.get('ingredients')?.value;
        ingredients.forEach((ingredient: any, index: number) => {
          formData.append(`ingredients[${index}][ingredientname]`, ingredient.ingredientname);
          formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
          formData.append(`ingredients[${index}][unitId]`, ingredient.unitId);
        });

        // Chamar o serviço para atualizar a receita
        this.recipeService.update(formData).subscribe({
          next: () => {
            // Mostrar mensagem de sucesso
            Swal.fire({
              title: 'Edited!',
              text: 'The recipe has been updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/recipe/forApproval']);
            });
          },
          error: (err) => {
            // Mostrar mensagem de erro
            Swal.fire({
              title: 'Error!',
              text: 'There was a problem updating the recipe.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Error updating recipe', err);
          }
        });
      }
    });
  }
}


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.recipeForm.patchValue({ image: file });
    }
  }
}
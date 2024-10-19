import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryService } from 'src/services/category.Service';
import { Category } from 'src/models/category';
import { Difficulty } from 'src/models/difficulty';
import { DifficultyService } from 'src/services/difficulty.Service';
import { RecipeService } from 'src/services/recipe.Service';
import { IngredientService } from 'src/services/ingredient.Service'; 
import { IngredientRecipeService } from 'src/services/ingredientRecipe.Service'; 
import { UnitService } from 'src/services/unit.Service'; 



@Component({
  selector: 'app-newrecipe',
  templateUrl: './newrecipe.component.html',
  styleUrls: ['./newrecipe.component.css'],
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, FormsModule],
})
export class NewRecipeComponent implements OnInit {
  faTrash = faTrash;
  faTrashCan = faTrashCan;

  categories: any[] = [];
  difficulties: any[] = [];
  units: any[] = [];

  currentUser: string = '';

  recipeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private difficultyService: DifficultyService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService, 
    private ingredientRecipeService: IngredientRecipeService, 
    private unitService: UnitService 

  ) {
    this.currentUser = this.authService.getCurrentUser() || '';
  }

  ngOnInit() {
    this.getCategoryArray();
    this.getDifficultyArray();
    this.getUnitArray();

    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      preparation: ['', Validators.required],
      difficultyId: [null, Validators.required],
      duration: ['', Validators.required],
      pax: ['', Validators.required],
      user: [{ value: this.currentUser, disabled: true }, Validators.required],
      image: [null],
      categoryId: [null, Validators.required],
      ingredients: this.fb.array([], [Validators.minLength(2)]),

    });
    
        // Adicione ao menos dois campos de ingrediente automaticamente
        this.addIngredient();
        this.addIngredient();
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


  getCategoryArray() {
    this.categoryService.getAll().subscribe((response) => {
      this.categories = response;
    });
  }

  getDifficultyArray() {
    this.difficultyService.getAll().subscribe((response) => {
      this.difficulties = response;
    });
  }

  getUnitArray() {
    this.unitService.getAll().subscribe((response) => {
      this.units = response;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.recipeForm.patchValue({ image: file });
    }
  }

  SaveRecipe() {
    if (this.recipeForm.valid) {
      const formData = new FormData();
      
      // Adicionar os valores do formulário ao FormData
      formData.append('name', this.recipeForm.get('name')?.value);
      formData.append('description', this.recipeForm.get('description')?.value);
      formData.append('pax', this.recipeForm.get('pax')?.value);
      formData.append('categoryId', this.recipeForm.get('categoryId')?.value);
      formData.append('duration', this.recipeForm.get('duration')?.value);
      formData.append('preparation', this.recipeForm.get('preparation')?.value);
      formData.append('difficultyId', this.recipeForm.get('difficultyId')?.value);

      // Adicionar valores manualmente
      formData.append('approval', 'false'); // Adiciona 'true' como string
      formData.append('userId', '1'); // Adiciona o userId manualmente
      formData.append('recipeDate', new Date().toISOString()); // Adiciona a data atual em formato ISO

      // Adicionar a imagem se ela estiver presente
      const image = this.recipeForm.get('image')?.value;
      if (image) {
        formData.append('image', image);
      }

      // Enviar o formulário via serviço
      this.recipeService.save(formData).subscribe({
        next: (response) => {
          console.log("Receita gravada com sucesso", response);
          const recipeId = response.id; // Obter o recipeId após guardar a receita com sucesso
          //this.router.navigate(['/dashboard']);

            // Processar os ingredientes e associar ao recipeId
            const ingredients = this.recipeForm.get('ingredients')?.value;
            ingredients.forEach((ingredient: any) => {
                // Montar o payload para o backend validar ou criar o ingrediente
                const formDataIngredientRecipe = new FormData();
                formDataIngredientRecipe.append('recipeId', recipeId);
                formDataIngredientRecipe.append('ingredient.Name', ingredient.ingredientname); // Nome do ingrediente
                formDataIngredientRecipe.append('quantity', ingredient.quantity);
                formDataIngredientRecipe.append('unitId', ingredient.unitId);

                // Chamar o serviço de IngredientRecipe no backend
                this.ingredientRecipeService.save(formDataIngredientRecipe).subscribe({
                    next: (res) => {
                        console.log('Ingrediente associado com sucesso:', res);
                    },
                    error: (err) => {
                          console.error('Erro ao associar ingrediente:', err);
                    }
                });
            });

            // Após associar todos os ingredientes, navega para o dashboard
            this.router.navigate(['/dashboard']);
        },
        error: (error) => {
            console.error('Erro ao gravar receita:', error);
        }
    });
} else {
    console.error('Formulário inválido!');
}
}

  redirectTo(url: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { CategoryService } from 'src/services/category.Service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

interface Recipe {
  image: string;
  name: string;
  category: string;
  description: string;
  difficulty: string;
  duration: number;
  servings: number;
  date: Date;
  status: string;
  user?: string;
  ingredients?: { name: string; quantity: string; unit: string }[]; // Adicione os ingredientes
  preparation?: string;
}

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrls: ['./viewall.component.css'],
  encapsulation: ViewEncapsulation.None, // Adicione isso se não estiver presente
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Adicione este import para usar o pipe 'date'
 
})
export class ViewallComponent implements OnInit {
  recipes: Recipe[] = [];
  paginatedRecipes: Recipe[] = [];
  currentPage: number = 1;
  recipesPerPage: number = 6;
  totalPages: number = 1;
  currentUser: string = '';

  constructor(private router: Router, private authService: AuthService, private categoryService: CategoryService
  ) {
    this.currentUser = this.authService.getCurrentUser() || '';
  }

  ngOnInit(): void {
    // Simulação de receitas
    this.recipes = this.getAllRecipes();
    this.totalPages = Math.ceil(this.recipes.length / this.recipesPerPage);
    this.updatePagination();
  }

  getAllRecipes(): Recipe[] {
    // Simulação de um fetch de receitas
    return [
      {
        image: 'assets/images/food.jpg',
        name: 'Classic Lasagna',
        category: 'Meat',
        description:
          'Layers of al dente pasta, rich meat sauce, and creamy béchamel, topped with melted cheese. Comfort food at its best!',
        difficulty: 'Medium',
        duration: 45,
        servings: 2,
        date: new Date(),
        status: 'Approved',
        user: this.currentUser,
        ingredients: [
          { name: 'Pasta', quantity: '500', unit: 'grams' },
          { name: 'Meat', quantity: '300', unit: 'grams' },
        ],
        preparation: `Refogue a cebola e o alho, adicione a carne moída e cozinhe até dourar. &&
                      Acrescente molho de tomate e temperos, cozinhando por 20 minutos. &&
                      Prepare o molho bechamel: derreta a manteiga, adicione a farinha, depois o leite, e mexa até engrossar. &&
                      Monte a lasanha em camadas alternadas de massa, molho de carne, bechamel e queijo. &&
                      Asse a 180°C por 25 minutos coberto com papel alumínio. Retire o alumínio e asse por mais 15-20 minutos até dourar.`,
      },

      {
        image: 'assets/images/salmon.webp',
        name: 'Grilled Salmon',
        category: 'Fish',
        description:
          'Juicy grilled salmon fillet seasoned with lemon, garlic, and fresh herbs. A perfect blend of smoky and tangy flavors, served with a side of roasted vegetables. Healthy, delicious, and easy to prepare.',
        difficulty: 'Easy',
        duration: 20,
        servings: 2,
        date: new Date(),
        status: 'Pending',
        user: this.currentUser,
        ingredients: [
          { name: 'Salmon', quantity: '300', unit: 'grams' },
          { name: 'Garlic', quantity: '2', unit: 'units' },
        ],
        preparation: `Tempere os lombos de salmão com o sumo de limão, alho picado, 1 colher de sopa de azeite, sal e pimenta. Deixe marinar durante 15-20 minutos. &&
        Enquanto o salmão está a marinar, misture as rodelas de curgete e abóbora com o restante azeite, sal e pimenta. &&
        Aqueça a grelha em lume médio-alto e grelhe os vegetais durante 3-4 minutos de cada lado, até estarem tenros. &&
        Grelhe o salmão durante 4-5 minutos de cada lado, ou até atingir o ponto de cozedura desejado e ficar com as marcas da grelha. &&
        Sirva o salmão grelhado acompanhado dos vegetais grelhados, decorado com ervas frescas.`

      },

      {
        image: 'assets/images/veg.webp',
        name: 'Vegetable Stir-Fry',
        category: 'Vegetarian',
        description:
          'Crisp and colorful vegetables stir-fried with a savory garlic soy sauce. A quick, healthy, and flavorful vegetarian dish that pairs perfectly with steamed rice or noodles for a satisfying meal.',
        difficulty: 'Easy',
        duration: 35,
        servings: 4,
        date: new Date(),
        status: 'Rejected',
        user: this.currentUser,
        ingredients: [
          { name: 'Vegetable mix', quantity: '500', unit: 'grams' },
          { name: 'Soy Sauce', quantity: '30', unit: 'mililiters' },
        ],
        preparation: `Aqueça uma frigideira grande ou wok em lume médio-alto e adicione o óleo de sésamo. &&
               Junte o alho picado e deixe refogar por cerca de 30 segundos, até libertar o aroma. &&
               Acrescente os vegetais cortados (curgete, cenoura, pimentos, cebola roxa, rabanetes) e salteie por cerca de 4-5 minutos até começarem a amolecer, mas mantendo a crocância. &&
               Adicione o molho de soja, uma pitada de pimenta, e mexa bem para cobrir todos os vegetais. &&
               Continue a cozinhar por mais 2-3 minutos, até os vegetais estarem bem cozinhados mas ainda crocantes. &&
               Sirva os vegetais salteados sobre arroz ou noodles cozidos, decorados com ervas frescas como coentros ou manjericão.`

      },

      {
        image: 'assets/images/soup.jpg',
        name: 'Tomato Basil Soup',
        category: 'Soup',
        description:
          'A rich and creamy tomato basil soup made with ripe tomatoes, fresh basil, and a touch of cream. Perfectly seasoned and comforting, ideal for a cozy lunch or as a starter to a delightful dinner.',
        difficulty: 'Medium',
        duration: 50,
        servings: 6,
        date: new Date(),
        status: 'Pending',
        user: this.currentUser,
        ingredients: [
          { name: 'Tomato', quantity: '200', unit: 'grams' },
          { name: 'Fresh Basil', quantity: '30', unit: 'grams' },
        ],
        preparation: `Aqueça um pouco de azeite numa panela grande em lume médio. &&
               Refogue a cebola picada e o alho até ficarem macios e translúcidos, cerca de 5 minutos. &&
               Adicione os tomates frescos picados e refogue por mais alguns minutos, mexendo ocasionalmente. &&
               Acrescente o caldo de legumes e as folhas de manjericão fresco, depois deixe levantar fervura. &&
               Reduza o lume e deixe a sopa cozinhar por cerca de 20 minutos para intensificar os sabores. &&
               Triture a sopa com uma varinha mágica até obter uma textura suave e cremosa. &&
               Acrescente natas a gosto e ajuste os temperos com sal e pimenta. &&
               Sirva a sopa quente, decorada com algumas folhas de manjericão fresco.`

      },

      {
        image: 'assets/images/choc.webp',
        name: 'Chocolate Lava Cake',
        category: 'Dessert',
        description:
          'Indulge in a rich chocolate lava cake with a gooey, molten center. Served warm with a scoop of vanilla ice cream, this decadent dessert is perfect for satisfying your sweet tooth cravings.',
        difficulty: 'Hard',
        duration: 60,
        servings: 4,
        date: new Date(),
        status: 'Approved',
        user: this.currentUser,
        ingredients: [
          { name: 'Culinary chocolate', quantity: '100', unit: 'grams' },
          { name: 'Vanilla Ice Cream', quantity: '50', unit: 'grams' },
        ],
        preparation: `Derreta o chocolate e a manteiga em banho-maria, mexendo até obter uma mistura homogénea. &&
               Em outra tigela, bata os ovos, as gemas e o açúcar até obter uma mistura clara e espumosa. &&
               Adicione o chocolate derretido à mistura de ovos e mexa suavemente até incorporar. &&
               Acrescente a farinha peneirada e envolva delicadamente na mistura. &&
               Unte formas individuais com manteiga e polvilhe com cacau em pó. &&
               Distribua a massa pelas formas, preenchendo até 2/3 de cada forma. &&
               Leve ao forno pré-aquecido a 200°C durante cerca de 10-12 minutos, ou até que os bolos estejam firmes nas bordas, mas com o centro ainda mole. &&
               Retire do forno, desenforme e sirva imediatamente com uma bola de gelado de baunilha por cima.`

      },

      {
        image: 'assets/images/mojito.jpg',
        name: 'Mojito',
        category: 'Drink',
        description:
          'A refreshing mojito with muddled fresh mint, lime, and sugar, topped with sparkling soda and a splash of rum. Perfect for hot summer days or as a delightful evening cocktail with friends.',
        difficulty: 'Easy',
        duration: 15,
        servings: 4,
        date: new Date(),
        status: 'Pending',
        user: this.currentUser,
        ingredients: [
          { name: 'Rum', quantity: '30', unit: 'mililiters' },
          { name: 'Lime', quantity: '1', unit: 'unit' },
        ],
        preparation: `Num copo alto, adicione as folhas de hortelã e o açúcar. &&
               Esmague suavemente as folhas de hortelã com um pilão, para libertar o aroma e misturar o açúcar. &&
               Corte o limão em quartos e esprema o sumo diretamente no copo, deixando também os pedaços de limão. &&
               Encha o copo com gelo até ao topo. &&
               Adicione o rum e complete com água com gás, mexendo ligeiramente. &&
               Decore com mais folhas de hortelã e sirva com uma palhinha.`

      },

      {
        image: 'assets/images/shrimp.webp',
        name: 'Garlic Shrimp Skewers',
        category: 'Appetizer',
        description:
          'Succulent shrimp marinated in garlic, olive oil, and fresh herbs, then grilled to perfection. A savory, quick, and easy appetizer that’s sure to impress.',
        difficulty: 'Medium',
        duration: 25,
        servings: 3,
        date: new Date(),
        status: 'Rejected',
        user: this.currentUser,
        ingredients: [
          { name: 'Shrimp', quantity: '50', unit: 'grams' },
          { name: 'Garlic', quantity: '4', unit: 'units' },
        ],
        preparation: `Numa taça, misture o alho picado, azeite e ervas frescas. &&
               Adicione os camarões à marinada e deixe marinar por 20-30 minutos. &&
               Coloque os camarões em espetos de madeira ou metal, intercalando-os, se desejar, com pedaços de legumes. &&
               Aqueça a grelha a fogo médio-alto. &&
               Grelhe os camarões por 2-3 minutos de cada lado, até ficarem dourados e completamente cozidos. &&
               Sirva de imediato, decorado com ervas frescas e uma fatia de limão para espremer por cima.`

      },

      // Adicione mais receitas conforme necessário...
    ];
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.recipesPerPage;
    const endIndex = startIndex + this.recipesPerPage;
    this.paginatedRecipes = this.recipes.slice(startIndex, endIndex);
  }

  // Método para gerar um array com os números das páginas
  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Método para ir para uma página específica
  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  // Atualize os métodos `nextPage` e `previousPage` se necessário
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToRecipeDetails(recipe: Recipe): void {
    this.router.navigate(['/recipe/recipe-details'], { state: { recipe } });
  }
}

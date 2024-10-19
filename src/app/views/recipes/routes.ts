import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Recipes'
    },

    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },

      {
        path: 'createnew',
        loadComponent: () => import('./createnew/newrecipe/newrecipe.component').then(m => m.NewRecipeComponent),
        data: {
          title: 'Create New Recipe'
        }
      },

      {
        path: 'viewall',
        loadComponent: () => import('./viewall/viewall/viewall.component').then(m => m.ViewallComponent),
        data: {
          title: 'View All Recepies'
        }
      },

      {
        path: 'recipe-details',
        loadComponent: () => import('./recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent),
        data: {
          title: 'Recipe Details'
        }
      },

    ]
  }
];

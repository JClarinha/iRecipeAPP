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

      {
        path: 'favourites',
        loadComponent: () => import('./favourites/favourites.component').then(m => m.FavouritesComponent),
        data: {
          title: 'Favourites'
        }
      },

      {
        path: 'forApproval',
        loadComponent: () => import('./for-approval/for-approval.component').then(m => m.ForApprovalComponent),
        data: {
          title: 'For Approval'
        }
      },

      {
        path: 'approvalDetail',
        loadComponent: () => import('./approval-detail/approval-detail.component').then(m => m.ApprovalDetailComponent),
        data: {
          title: 'Approval Detail'
        }
      },

      {
        path: 'edit/:id',
        loadComponent: () => import('./edit-recipe/edit-recipe.component').then(m => m.EditRecipeComponent),
        data: {
          title: 'Edit Recipe'
        }
      },

      
      {
        path: 'approved-recipes',
        loadComponent: () => import('./approved-recipes/approved-recipes.component').then(m => m.ApprovedRecipesComponent),
        data: {
          title: 'Approved Recipes'
        }
      },

      {
        path: 'rejected-recipes',
        loadComponent: () => import('./rejected-recipes/rejected-recipes.component').then(m => m.RejectedRecipesComponent),
        data: {
          title: 'Rejected Recipes'
        }
      },

    ]
  }
];

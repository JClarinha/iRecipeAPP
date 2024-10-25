import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },

    children: [


      {
        path: 'create-new',
        loadComponent: () => import('./create-new/create-new.component').then(m => m.CreateNewComponent),
        data: {
          title: 'Create New User'
        }
      },

      {
        path: 'view-all',
        loadComponent: () => import('./view-all/view-all.component').then(m => m.ViewAllComponent),
        data: {
          title: 'View All Users'
        }
      },

    ]
  }
];

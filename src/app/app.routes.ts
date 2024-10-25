import { ForgotpwComponent } from './views/pages/forgotpw/forgotpw/forgotpw.component';
import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { LoginComponent } from './views/pages/login/login.component';
import { AuthGuard } from 'src/services/auth.guard';
import { RegisterComponent } from './views/pages/register/register.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'recipe',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'users',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },

 {
  path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    }
 },

 {
  path: 'forgotpw',
    component: ForgotpwComponent,
    data: {
      title: 'Forgot Password Page',
    }
 },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard], // Protege as rotas abaixo com o AuthGuard
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
      },
      {
        path: 'recipe',
        loadChildren: () =>
          import('./views/recipes/routes').then((m) => m.routes),
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./views/users/routes').then((m) => m.routes),
      }

      
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then((m) => m.Page404Component),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then((m) => m.Page500Component),
    data: {
      title: 'Page 500',
    },
  },


 {
  path: '**',
  redirectTo: '404',
},
];

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
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/routes').then((m) => m.routes),
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/routes').then((m) => m.routes),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/routes').then((m) => m.routes),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/routes').then((m) => m.routes),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/routes').then((m) => m.routes),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/routes').then((m) => m.routes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/routes').then((m) => m.routes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/routes').then((m) => m.routes),
      },

      // Adicione outras rotas protegidas pelo AuthGuard aqui
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



 /* {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then((m) => m.RegisterComponent),
    data: {
      title: 'Register Page',
    },
  },*/
 /* {
    path: '**',
    redirectTo: 'dashboard',
  },*/
];

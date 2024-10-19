/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,  // Spread operator para incluir os providers existentes
  providers: [provideHttpClient(), ...appConfig.providers]  // Certifica-te que inclui os outros providers
}).catch(err => console.error(err));
  

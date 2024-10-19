import { Component, NgModule } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { Router } from '@angular/router';
import {FormsModule } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [FormsModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})

export class LoginComponent {
  username: string = '';  // Certifique-se de inicializar as propriedades
  password: string = '';  // Certifique-se de inicializar as propriedades

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.authService.login(this.username, this.password)) {  // Passe ambos os argumentos
      this.router.navigate(['/dashboard']);
    } else {
      alert('Login failed. Please check your username and password.');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPw() {
    this.router.navigate(['/forgotpw']);
  }

}

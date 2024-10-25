import { Component, NgModule } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { CommonModule } from '@angular/common'; 
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  email: string = '';  // Inicializa a propriedade
  password: string = '';  // Inicializa a propriedade
  showPassword: boolean = false; // Controle de visibilidade da senha
  loading: boolean = false; // Controle de estado de carregamento

  constructor(private authService: AuthService, private router: Router) {}

  // Método para alternar a visibilidade da senha
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loading = true; // Inicia o carregamento

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // O token e o usuário já são gerenciados no AuthService
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']); // Navegar para o dashboard em caso de sucesso
      },
      error: (error) => {
        console.error('Login failed', error);   
        this.loading = false; // Redefine o carregamento no caso de erro     
      },
      complete: () => {
        this.loading = false; // Finaliza o carregamento independentemente do resultado
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPw() {
    this.router.navigate(['/forgotpw']);
  }
}

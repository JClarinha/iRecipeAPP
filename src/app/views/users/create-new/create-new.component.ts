import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterModule } from '@angular/router';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AbstractControl, ValidatorFn } from '@angular/forms';


import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule para usar o ngClass e outros recursos do Angular




// Validador composto para verificar e-mail e domínio
export function emailWithDomainValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;
    if (!email) return null; // Não valida se não houver valor

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Verifica se é um e-mail válido
    const domainValid = /(\.com|\.pt|\.net)$/.test(email); // Verifica se o domínio termina com .com, .pt ou .net

    if (!emailValid) {
      return { emailInvalid: true }; // Retorna erro se o e-mail não for válido
    }

    if (!domainValid) {
      return { domainInvalid: true }; // Retorna erro se o domínio não for válido
    }

    return null; // Retorna null se tudo estiver correto
  };
}


@Component({
  selector: 'app-create-new',
  standalone: true,
  imports: [
    RouterModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective, 
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],  templateUrl: './create-new.component.html',
  styleUrl: './create-new.component.scss'
})


export class CreateNewComponent {
  registerForm: FormGroup;
  loading: boolean = false; // Controlo de estado de carregamento
  showPassword: boolean = false; // Controlo de visibilidade da senha
  iconVisible: boolean = false; // Adicione esta linha



  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], // Nome com mínimo de 2 caracteres
      email: ['', [Validators.required, emailWithDomainValidator() ]], //validação de email
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]], // Validação personalizada de senha
    });
  }

  

  // Validator customizado para verificar a força da senha
  passwordStrengthValidator(control: any) {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
    const valid = hasUpperCase && hasSpecialChar;
    return !valid ? { passwordStrength: true } : null;
  }

  // Verifica se o campo é inválido e foi tocado ou alterado
  isFieldInvalid(field: string) {
    return (
      this.registerForm.get(field)?.invalid && 
      (this.registerForm.get(field)?.touched || this.registerForm.get(field)?.dirty)
    );
  }

    // Método para alternar a visibilidade da senha
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }

  // Método para tratar o envio do formulário
  onSubmit() {
    if (this.registerForm.valid) {
      const { name, password, email} = this.registerForm.value; // Desestruturação dos valores do formulário
      this.loading = true; // Inicia o carregamento
      this.authService.register(name, password, email).subscribe({
        next: (response) => {
          console.log('Registo bem-sucedido!', response);
        },
        error: (error) => {
          console.error('Erro no registo', error);
        },
        complete: () => {
          this.loading = false; 
          console.log('Requisição concluída.');
          this.router.navigate(['/users/view-all']); 
          
        }
      });
    }
  }


}

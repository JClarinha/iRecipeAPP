import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { User } from 'src/models/user';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated: boolean = false;
  private inactivityTimer: any;
  // private currentUser: string | undefined;
  apiUrl = 'https://localhost:7199/';

  constructor(private router: Router, private httpClient: HttpClient) {
    this.setupInactivityListener();
    //this.currentUser = localStorage.getItem('username') || 'JohnDoe';
  }

  // Método para obter todos os utilizadores
  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl + 'iRecipeAPI/User');
  }

  // Método para obter utilizador por ID
  getById(id: number): Observable<User> {
    return this.httpClient.get<User>(this.apiUrl + 'iRecipeAPI/User/' + id);
  }

  // Método para obter utilizador por email
  getByEmail(email: string): Observable<User> {
    return this.httpClient.get<User>(this.apiUrl + 'iRecipeAPI/User/' + email);
  }

  // Método para criar um utilizador
  save(user: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl + 'iRecipeAPI/User', user);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/User/' + id);
  }

  /*
  // Método para registar utilizador
  register(name: string, password: string, email: string): Observable<User> {
    const body = { name, password, email };
    console.log('Corpo da requisição:', body);
    return this.httpClient.post<User>(
      this.apiUrl + 'iRecipeAPI/User/register',
      body
    );
  }*/

  // Método para registar utilizador
  register(name: string, password: string, email: string): Observable<User> {
    const body = { name, password, email };
    console.log('Corpo da requisição:', body);

    return this.httpClient
      .post<User>(this.apiUrl + 'iRecipeAPI/User/register', body)
      .pipe(
        tap(() => {
          Swal.fire({
            icon: 'success',
            title: 'Welcome aboard!',
            text: 'Your account has been created successfully.',
            confirmButtonText: 'Great!',
          });
        }),
        catchError((error) => {
          // Exibir diferentes mensagens dependendo do status do erro
          if (error.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'Email Already in Use',
              text: 'The email you provided is already in use. Please try a different one.',
              confirmButtonText: 'Got it!',
            });
          } else if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: 'An unexpected error occured. Please try again later.',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: 'Something went wrong during the registration process. Please try again.',
              confirmButtonText: 'OK',
            });
          }
          return throwError(() => error);
        })
      );
  }

  /*
  login(username: string, password: string): boolean {
    if (username === '123' && password === '123') {
      this.authenticated = true;
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username', username); // Armazena o nome de usuário
      this.startInactivityTimer();
      return true;
    }
    return false;
  }*/

  // Método para fazer login
  login(email: string, password: string): Observable<any> {
    const body: User = {
      id: 0,
      name: '',
      email: email,
      password: password,
      admin: false,
    };

    return this.httpClient
      .post<any>(this.apiUrl + 'iRecipeAPI/User/login', body)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              name: response.name,
              email: email,
              admin: response.admin,
            })
          );
          this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          if (error.status === 401) {
            // Exibe a notificação de sessão expirada
            Swal.fire({
              icon: 'warning',
              title: 'Sessão Expirada',
              text: 'Your session expired. Please, login again!',
              confirmButtonText: 'OK',
            }).then(() => {
              this.logout(); // Faz logout apenas após confirmação
            });
          }
          return throwError(() => error);
        })
      );
  }

  // Método para logout
  logout(): void {
    this.authenticated = false;
    localStorage.removeItem('token'); // Remove o token do localStorage
    localStorage.removeItem('currentUser'); // Remove o objeto User
    clearTimeout(this.inactivityTimer);
    Swal.fire({
      icon: 'info',
      title: 'Logout',
      text: 'You logged out!',
      confirmButtonText: 'OK',
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  // Método para verificar se o utilizador está autenticado
  isAuthenticated(): boolean {
    return this.authenticated || localStorage.getItem('token') !== null; // Verifica se o token existe
  }

  // Método para obter o utilizador atual
  getCurrentUser(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null; // Retorna o objeto User se existir
  }

  // Método para iniciar o temporizador de inatividade
  private startInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'You reached your innactivity time. Please, login again!',
        confirmButtonText: 'OK',
      });
      this.logout(); // Faz logout após 20 minutos
    }, 600000); // 10 minutos em milissegundos
  }

  // Método para reiniciar o temporizador de inatividade
  private resetInactivityTimer(): void {
    this.startInactivityTimer();
  }

  // Método para configurar o listener de inatividade
  private setupInactivityListener(): void {
    document.addEventListener('mousemove', () => this.resetInactivityTimer());
    document.addEventListener('click', () => this.resetInactivityTimer());
    document.addEventListener('keypress', () => this.resetInactivityTimer());
    document.addEventListener('touchstart', () => this.resetInactivityTimer());
  }
}

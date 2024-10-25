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
 
  apiUrl = 'https://localhost:7199/';

  constructor(private router: Router, private httpClient: HttpClient) {
    this.setupInactivityListener();
    
  }

  
  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl + 'iRecipeAPI/User');
  }

 
  getById(id: number): Observable<User> {
    return this.httpClient.get<User>(this.apiUrl + 'iRecipeAPI/User/' + id);
  }

  
  getByEmail(email: string): Observable<User> {
    return this.httpClient.get<User>(this.apiUrl + 'iRecipeAPI/User/' + email);
  }

  
  save(user: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl + 'iRecipeAPI/User', user);
  }


  update(user: any): Observable<any> {
    return this.httpClient.put(this.apiUrl + 'iRecipeAPI/User', user);  
  }
  
  

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/User/' + id);
  }


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
            id: response.id,
            name: response.name,
            email: email,
            admin: response.admin,
          })
        );
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        if (error.status === 401) {
         
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
            confirmButtonText: 'OK',
          });
        } else if (error.status === 403) {
          
          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: 'Your session expired. Please, login again!',
            confirmButtonText: 'OK',
          }).then(() => {
            this.logout(); 
          });
        } else if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please check your input values and try again.',
            confirmButtonText: 'OK',
          });
        } else if (error.status === 500) {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'An unexpected error occurred. Please try again later.',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Something went wrong during the login process. Please try again.',
            confirmButtonText: 'OK',
          });
        }
        return throwError(() => error);
      })
    );
}


  
  logout(): void {
    this.authenticated = false;
    localStorage.removeItem('token'); 
    localStorage.removeItem('currentUser'); 
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

  
  isAuthenticated(): boolean {
    return this.authenticated || localStorage.getItem('token') !== null; 
  }

  
  getCurrentUser(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null; 
  }

  
  private startInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'You reached your innactivity time. Please, login again!',
        confirmButtonText: 'OK',
      });
      this.logout(); 
    }, 600000); 
  }

  
  private resetInactivityTimer(): void {
    this.startInactivityTimer();
  }

  
  private setupInactivityListener(): void {
    document.addEventListener('mousemove', () => this.resetInactivityTimer());
    document.addEventListener('click', () => this.resetInactivityTimer());
    document.addEventListener('keypress', () => this.resetInactivityTimer());
    document.addEventListener('touchstart', () => this.resetInactivityTimer());
  }
}

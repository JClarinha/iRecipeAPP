import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated: boolean = false;
  private inactivityTimer: any;
  private currentUser: string | undefined;


  constructor(private router: Router) {
    this.setupInactivityListener();
    this.currentUser = 'JohnDoe';  // Isto deve ser substituído pelo usuário real após o login
  }

  login(username: string, password: string): boolean {
    if (username === '123' && password === '123') {
      this.authenticated = true;
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username', username); // Armazena o nome de usuário
      this.startInactivityTimer();
      return true;
    }
    return false;
  }

  logout(): void {
    this.authenticated = false;
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username'); // Remove o nome de usuário
    clearTimeout(this.inactivityTimer);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authenticated || localStorage.getItem('authenticated') === 'true';
  }

  getCurrentUser(): string | undefined {
    return this.currentUser;
  }

  setCurrentUser(user: string): void {
    this.currentUser = user;
  }

  private startInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    console.log('Inactivity timer started');
    this.inactivityTimer = setTimeout(() => {
      console.log('Logging out due to inactivity');
      this.logout();
    }, 1200000); // 20 minutos em milissegundos
  }

  private resetInactivityTimer(): void {
    //console.log('Inactivity timer reset');
    this.startInactivityTimer();
  }

  private setupInactivityListener(): void {
    document.addEventListener('mousemove', () => {
      //console.log('Mouse moved');
      this.resetInactivityTimer();
    });
    document.addEventListener('click', () => {
      //console.log('Click detected');
      this.resetInactivityTimer();
    });
    document.addEventListener('keypress', () => {
      //console.log('Key pressed');
      this.resetInactivityTimer();
    });
    document.addEventListener('touchstart', () => {
      //console.log('Touch start detected');
      this.resetInactivityTimer();
    });
  }
}

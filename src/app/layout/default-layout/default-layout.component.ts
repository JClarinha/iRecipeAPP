import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
//import { navItems } from './_nav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from 'src/services/auth.service'; // Serviço de autenticação
import { navItemsAdmin, navItemsUser } from './_nav'; // Importa as opções para admin e utilizador normal



function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    FontAwesomeModule
  ]
})
export class DefaultLayoutComponent {
 // public navItems = navItems;
  public navItems: any[] = []; // Inicializa vazia
  isAdmin: boolean = false; // Verificação se é admin

  constructor(private authService: AuthService) {} // Injeção do AuthService para verificar o papel do utilizador

  ngOnInit(): void {
    this.checkUserRole();
  }

// Função para verificar o papel do utilizador
checkUserRole() {
  const currentUser = this.authService.getCurrentUser(); // Obtém o utilizador atual a partir do localStorage
  if (currentUser && currentUser.admin === true) {
    this.isAdmin = true; // Se o utilizador for admin
    this.navItems = navItemsAdmin; // Carrega as opções de admin
  } else {
    this.isAdmin = false; // Se não for admin
    this.navItems = navItemsUser; // Carrega as opções de utilizador normal
  }
}

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}

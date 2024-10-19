import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterModule } from '@angular/router';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [RouterModule,ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})


export class RegisterComponent {

  constructor(private router: Router) { }


  backToLogin() {
    this.router.navigate(['/login']);
  }

}

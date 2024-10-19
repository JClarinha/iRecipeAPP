import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterModule } from '@angular/router';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';


@Component({
  selector: 'app-forgotpw',
  templateUrl: './forgotpw.component.html',
  styleUrls: ['./forgotpw.component.scss'],
  standalone: true,
  imports: [NgStyle, FormsModule, RouterModule,ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]

})
export class ForgotpwComponent {

  email: string = '';


  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    alert('A link has been sent to your email address.');
  }



}

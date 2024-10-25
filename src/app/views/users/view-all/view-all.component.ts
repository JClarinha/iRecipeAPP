
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/auth.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoryService } from 'src/services/category.Service';
import { RecipeService } from 'src/services/recipe.Service';
import { Recipe } from 'src/models/recipe';
import { DifficultyService } from 'src/services/difficulty.Service';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,FontAwesomeModule],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss'
})
export class ViewAllComponent {

  users: any[] = [];
  faTrashCan = faTrashCan;
  faPencilAlt = faPencilAlt;

  modifiedUsers: any[] = []; 



  constructor(private router: Router, private userService: AuthService,
  ){}


  ngOnInit(): void {
    this.getAllUsers();
  }


  getAllUsers() {
    this.userService.getAll().subscribe((response: User[]) => 
    this.users = response)
  }


  deleteUser(userId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(userId).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The user has been deleted.',
              'success'
            );
           
            this.users = this.users.filter(user => user.id !== userId);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'There was an error deleting the user.',
              confirmButtonText: 'OK'
            });
            console.error('Error deleting user:', err);
          }
        });
      }
    });
  }
  

  saveUser(user: User) {
    
  }

  onAdminCheckboxChange(user: any) {
  
    if (!this.modifiedUsers.includes(user)) {
      this.modifiedUsers.push(user);
    }
  }



  saveAdminChanges() {
  this.modifiedUsers.forEach((user) => {
    const updatedUser = {
      id: user.id,
      admin: user.admin,  
      name: user.name,
      email: user.email,
      password: user.password
    };

    this.userService.update(updatedUser).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'User updated successfully!',
          text: `User ${user.name} has been updated.`,
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error updating user!',
          text: `There was an error updating ${user.name}: ${err.error}`,
          confirmButtonText: 'OK'
        });
        console.error(`Error updating user ${user.name}:`, err);
      }
    });
  });

 
  this.modifiedUsers = [];
}

  

  
}


import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../data/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  userRoles: { roleId: number, roleName: string }[] = [];
  userId: number | null = null;
  userForm = new FormGroup({
    displayName: new FormControl('', Validators.required), // Changed from userName
    emailId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    role: new FormControl(null, Validators.required) // Ensure this is a number
  });
  
  private subscriptions = new Subscription();

  constructor(private userService: UserService, private router: Router,  private route: ActivatedRoute) {}

  onSubmit() {
    if (this.userForm.valid) {
      const formData = {
        displayName: this.userForm.controls.displayName.value ?? '',  
        emailId: this.userForm.controls.emailId.value ?? '',
        password: this.userForm.controls.password.value ?? '',
        roleId: this.userForm.controls.role.value ? Number(this.userForm.controls.role.value) : 0  // Ensure a number
      };
  
      if (this.userId) {
        // **Update existing user**
        this.userService.updateUser(this.userId, formData).subscribe(() => {
          this.router.navigate(['/app/users']);
        });
      } else {
        // **Create new user**
        this.userService.createUser(formData).subscribe(() => {
          this.router.navigate(['/app/users']);
        });
      }
    }
  }
  
  
  
  
  

getUserRole() {
  this.subscriptions.add(
    this.userService.getUserRoles().subscribe(
      (roles:any) => {
        this.userRoles = roles.map((role: any) => ({
          roleId: Number(role.roleId), // Convert to number
          roleName: role.roleName
        }));
  }));
}

ngOnInit(): void{
  this.getUserRole();
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.userId = Number(id);
      this.getUserById(this.userId);
    }
  });
}

getUserById(userId: number) {
  this.userService.getUserById(userId).subscribe(user => {
    this.userForm.patchValue({
      displayName: user.displayName,
      emailId: user.emailId,
      password: user.password,
      role: user.roleId
    });

    // Make fields readonly for existing users
    this.userForm.controls.displayName.disable();
    this.userForm.controls.emailId.disable();
    this.userForm.controls.password.disable();
  });
}

}
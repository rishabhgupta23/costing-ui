import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../data/services/user/user.service';
import { AuthUtil } from '../../../../shared/utils/auth.util';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  email: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private userService: UserService, private router: Router) {
    const decoded = AuthUtil.getDecodedToken();
    this.email = decoded?.email || decoded?.sub || '';
  }

    ngOnInit(): void {
    if (!AuthUtil.resetRequired) {
      this.router.navigate(['/app']);
    }
  }

submit() {
  if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
    alert('All fields are required.');
    return;
  }

  if (!this.passwordPattern.test(this.newPassword)) {
    alert('Password must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character and be at least 8 characters long.');
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    alert('New password and confirm password do not match.');
    return;
  }

  this.userService.changePassword({
    oldPassword: this.oldPassword,
    newPassword: this.newPassword,
    email: this.email,
    confirmPassword: this.confirmPassword
  }).subscribe({
    next: (res) => {
      AuthUtil.accessToken = res.token;
      this.router.navigate(['/app']);
    },
    error: (err) => {
      console.error('Password change failed', err);
      alert('Failed to change password. Please try again.');
    }
  });
}

backToLogin() {
  AuthUtil.accessToken = '';
  this.router.navigate(['/login']);
}
}
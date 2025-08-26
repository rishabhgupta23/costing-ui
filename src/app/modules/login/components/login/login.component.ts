import { Component } from '@angular/core';
import { UserService } from '../../../../data/services/user/user.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../../data/models/user';
import { AuthUtil } from '../../../../shared/utils/auth.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userName: string = '';
  password: string = '';

  hidePassword = true;
  constructor(private userService: UserService, private router: Router) {

  }

login() {
  if (this.userName && this.password) {
    const body: LoginRequest = {
      email: this.userName,
      password: this.password
    };

    this.userService.login(body).subscribe((res) => {
      AuthUtil.accessToken = res.token;

      const decoded = AuthUtil.getDecodedToken();
      const resetRequired = decoded?.resetRequired ?? false;

      if (resetRequired) {
        this.router.navigate(['/change-password']);
      } else {
        this.router.navigate(['/app']);
      }
    });
  }
}


  goToContactUs() {
    this.router.navigateByUrl('/contact-us');
  }
}

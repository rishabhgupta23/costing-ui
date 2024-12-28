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

  constructor(private userService: UserService, private router: Router) {

  }

  login() {
    if(this.userName && this.password) {
      const body : LoginRequest = {
        email: this.userName,
        password: this.password
      };
      this.userService.login(body).subscribe((res) => {
        AuthUtil.accessToken = res.token;
        this.router.navigate(['/app']);
      });
    }
  }
}

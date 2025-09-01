import { Component } from '@angular/core';
import { User } from '../../../data/models/user';
import { UserService } from '../../../data/services/user/user.service';
import { Observable } from 'rxjs';
import { AuthUtil } from 'src/app/shared/utils/auth.util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: User = undefined as any;
  showUserInfo= false;

  constructor(private userService: UserService) {
    if(!AuthUtil.resetRequired){
    this.getCurrentUser();
    this.showUserInfo=true;}
  }

  getCurrentUser() {
    this.userService.whoAmI().subscribe((res) => {
        this.user = res
      }
    );
  }
}

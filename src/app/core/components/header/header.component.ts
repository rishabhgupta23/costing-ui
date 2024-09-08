import { Component } from '@angular/core';
import { User } from '../../../data/models/user';
import { UserService } from '../../../data/services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: User = undefined as any;

  constructor(private userService: UserService) {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userService.whoAmI().subscribe((res) => {
        this.user = res
      }
    );
  }
}

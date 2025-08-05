import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AppConfig } from '../../../config/app.config';
import { UserService } from 'src/app/data/services/user/user.service';
import { UserRole } from 'src/app/shared/constants/userrole.constants';
import { MenuItem } from 'src/app/data/models/menu-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems: MenuItem[] = AppConfig.MENU_ITEMS;
  visibleTopMenuItems: MenuItem[] = [];
  visibleBottomMenuItems: MenuItem[] = [];
  selectedMenu = undefined;
  userRole: UserRole = undefined as any;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private userService: UserService,
  ) {
    this.listenToMenuChanges();
    this.fetchUserRole();
  }

  listenToMenuChanges() {
    this.sidebarService.selectedMenu.subscribe(menuItem => {
      this.selectedMenu = menuItem;
    });
  }

  getValidUserRole(role: string): UserRole {
  const validRoles = Object.values(UserRole) as string[];
  return validRoles.includes(role) ? role as UserRole : UserRole.GUEST;
  }

  fetchUserRole() {
    this.userService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.userRole = this.getValidUserRole(user.roleName);
        this.setMenuVisibility();
      }
    });
  }

  setMenuVisibility() {
    this.visibleTopMenuItems = this.menuItems.filter(item => 
      (!item.position || item.position !== 'bottom') &&
      (!item.roles || item.roles.includes(this.userRole))
    );

    this.visibleBottomMenuItems = this.menuItems.filter(item => 
      item.position === 'bottom' &&
      (!item.roles || item.roles.includes(this.userRole))
    );
  }

  menuClicked(item: any) {
    this.router.navigateByUrl(item?.route);
  }
}


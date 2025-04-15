import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AppConfig } from '../../../config/app.config';
import { UserService } from 'src/app/data/services/user/user.service';
import { UserRole } from 'src/app/shared/constants/userrole.constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = AppConfig.MENU_ITEMS;
  selectedMenu = undefined;
  userRole: string = '';

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private userService: UserService, // ⬅️ ADD THIS
    private changeDetector: ChangeDetectorRef
  ) {
    this.listenToMenuChanges();
    this.fetchUserRole();
  }

  listenToMenuChanges() {
    this.sidebarService.selectedMenu.subscribe(menuItem => {
      this.selectedMenu = menuItem;
    });
  }
  isRoleLoaded = false;

  fetchUserRole() {
    this.userService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.userRole = user.roleName.toLowerCase();
        this.isRoleLoaded = true;
        this.changeDetector.detectChanges();
      }
    });
  }
  
  isSettingsVisible(item: any): boolean {
    return item.label !== 'Settings' || 
           (this.userRole === UserRole.ADMIN || this.userRole === UserRole.SUPERADMIN);
  }
  

  menuClicked(item: any) {
    this.router.navigateByUrl(item?.route);
  }
}

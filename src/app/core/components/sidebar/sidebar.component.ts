import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AppConfig } from '../../../config/app.config';
import { UserService } from 'src/app/data/services/user/user.service';
import { UserRole } from 'src/app/shared/constants/userrole.constants';
import { MenuItem } from 'src/app/data/models/menu-items';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { MatDialog } from '@angular/material/dialog';
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
    private dialog: MatDialog,
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
    if (item.label === 'Logout') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Confirm Logout',
          message: 'Are you sure you want to logout? All unsaved changes will be lost.',
          confirmButtonText: 'Logout',
          cancelButtonText: 'Stay'
        } as ConfirmDialogData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === DialogCloseResponse.POSITIVE) {
          localStorage.clear();
          this.userService.logout();
          this.router.navigate(['/login']);
        }
      });
      return;
    }
    this.router.navigateByUrl(item?.route);
  }
}


import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AppConfig } from '../../../config/app.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = AppConfig.MENU_ITEMS;
  selectedMenu = undefined;

  constructor(private router: Router, private sidebarService: SidebarService, private changeDetector: ChangeDetectorRef) {
    this.listenToMenuChanges();
  }

  listenToMenuChanges() {
    this.sidebarService.selectedMenu.subscribe(menuItem => {
      this.selectedMenu = menuItem;
   });
  }

  menuClicked(item: any) {
    this.router.navigateByUrl(item?.route);
  }

}

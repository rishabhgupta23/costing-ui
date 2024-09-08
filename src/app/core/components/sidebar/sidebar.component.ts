import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  menuItems = [
    {
      label: 'Parts',
      route: '/app/parts'
    },
    {
      label: 'Vendors',
      route: '/app/vendors'
    }
  ];

  selectedMenu = this.menuItems[0];

  constructor(private router: Router) {
    this.handleRouteChange();
  }

  handleRouteChange() {
    this.router.events
    .subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.menuItems.some(item => {
          if(item.route === val?.url) {
            this.selectedMenu = item;
            return true;
          }
          return false;
        })
      }
      
  });
  }

  menuClicked(item: any) {
    this.router.navigateByUrl(item?.route);
  }

}

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

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

  selectedMenu =  this.menuItems[0];


  constructor(private router: Router) { }


  handleRouteChange() {
    // this.router.events
    // .subscribe((val) => {
    //   if(val instanceof NavigationEnd) {
    //     this.menuItems.some(item => {
    //       if(item.route === val?.url) {
    //         this.selectedMenu = item;
    //         return true;
    //       }
    //       return false;
    //     })
    //   }    
    // });
  }
}

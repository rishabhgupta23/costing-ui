import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private selectedMenuSubject =  new BehaviorSubject<any>(AppConfig.MENU_ITEMS[0]);
  selectedMenu = this.selectedMenuSubject.asObservable();


  constructor(private router: Router) { }

  updateSelectedMenu(menuItem: any) {
    this.selectedMenuSubject.next(menuItem);
  }
}

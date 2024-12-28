import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppConfig } from './config/app.config';
import { SidebarService } from './core/services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'costing-ui';

  constructor(private router: Router, private sidebarService: SidebarService) {
    this.handleRouteChange();
  }

  handleRouteChange() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        AppConfig.MENU_ITEMS.some((item) => {
          if (item.route === val?.urlAfterRedirects) {
            this.sidebarService.updateSelectedMenu(item);
            return true;
          }
          return false;
        });
      }
    });
  }
}

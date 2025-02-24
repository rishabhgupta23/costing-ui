import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppConfig } from './config/app.config';
import { SidebarService } from './core/services/sidebar.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SVG_ICONS } from './config/asset.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'costing-ui';

  constructor(private router: Router, private sidebarService: SidebarService, 
    private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.handleRouteChange();
    this.registerIcons();
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

  registerIcons() {
    SVG_ICONS.forEach(icon => {
      console.log(icon);
      this.iconRegistry.addSvgIcon(icon.name, this.sanitizer.bypassSecurityTrustResourceUrl(icon.path));
    });
  }
}

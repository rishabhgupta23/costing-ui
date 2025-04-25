import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-landing',
  templateUrl: './config-landing.component.html',
  styleUrls: ['./config-landing.component.scss']
})
export class ConfigLandingComponent {
  constructor(private router:Router){}
  onTileClick(tile: string) {
    if (tile === 'category') {
      this.router.navigateByUrl("/app/config/category");
    } else if(tile === 'cost-factor'){
      this.router.navigateByUrl("/app/config/cost-factor");
    }else{
      alert('This feature is coming soon..')
    }
  }
}

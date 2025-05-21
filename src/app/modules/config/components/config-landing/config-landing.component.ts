import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-landing',
  templateUrl: './config-landing.component.html',
  styleUrls: ['./config-landing.component.scss']
})
export class ConfigLandingComponent {
tiles = [
  { label: 'Category', route: 'category' },
  {label : 'Cost Factors', route: 'cost-factors'},
  {label : 'Part Attribute', route: 'part-attribute'},
  {label : 'Part Template', route: 'part-template'}
];
  constructor(private router:Router){}
  onTileClick(tile: string) {
    if (tile === 'category') {
      this.router.navigateByUrl("/app/config/category");
    } else if(tile === 'cost-factor'){
      this.router.navigateByUrl("/app/config/cost-factor");
    }else if(tile==='part-attribute'){
      this.router.navigateByUrl("/app/config/part-attribute");
    }
    else{
      this.router.navigateByUrl("/app/config/part-template");
    }
  }
}

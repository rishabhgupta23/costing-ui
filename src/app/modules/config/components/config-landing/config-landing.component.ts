import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-config-landing',
  templateUrl: './config-landing.component.html',
  styleUrls: ['./config-landing.component.scss']
})
export class ConfigLandingComponent {
tiles = [
  { label: 'Category', route: 'category' },
  {label : 'Cost Factor', route: 'cost-factor'},
  {label : 'Part Attribute', route: 'part-attribute'},
  {label : 'Part Template', route: 'part-template'},  
];
  constructor(private router:Router, private route: ActivatedRoute){}
  onTileClick(route: string) {
    if (route) {
      this.router.navigate([route], { relativeTo: this.route });
    } else {
      alert('This feature is coming soon..');
    }
  }
}

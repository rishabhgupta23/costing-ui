import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-tools-dashboard',
  templateUrl: './tools-dashboard.component.html',
  styleUrls: ['./tools-dashboard.component.scss']
})
export class ToolsDashboardComponent implements OnInit, OnDestroy {
  tabs = [
    { label: "Cost Calculation", route: "calculate" },
    { label: "Production Plan", route: "production-plan" }
  ];

  activeTabLink = this.tabs[0].route;
  private sub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.activeTabLink = this.router.url.split('/').pop() || this.tabs[0].route;

    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.activeTabLink = e.urlAfterRedirects.split('/').pop() || this.tabs[0].route;
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

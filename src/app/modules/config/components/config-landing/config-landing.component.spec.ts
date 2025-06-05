import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLandingComponent } from './config-landing.component';
import { ActivatedRoute } from '@angular/router';

describe('ConfigLandingComponent', () => {
  let component: ConfigLandingComponent;
  let fixture: ComponentFixture<ConfigLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigLandingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } } // <-- Add this line
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

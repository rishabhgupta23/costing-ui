import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLandingComponent } from './config-landing.component';

describe('LandingComponent', () => {
  let component: ConfigLandingComponent;
  let fixture: ComponentFixture<ConfigLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigLandingComponent]
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

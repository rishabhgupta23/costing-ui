import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTemplateComponent } from './part-template.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule } from '../../config.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PartTemplateComponent', () => {
  let component: PartTemplateComponent;
  let fixture: ComponentFixture<PartTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ConfigModule, BrowserAnimationsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

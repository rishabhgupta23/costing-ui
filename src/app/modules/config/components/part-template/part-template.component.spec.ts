import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTemplateComponent } from './part-template.component';

describe('PartTemplateComponent', () => {
  let component: PartTemplateComponent;
  let fixture: ComponentFixture<PartTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartTemplateComponent]
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

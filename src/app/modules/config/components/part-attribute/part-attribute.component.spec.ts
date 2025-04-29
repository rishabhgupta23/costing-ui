import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartAttributeComponent } from './part-attribute.component';

describe('PartAttributeComponent', () => {
  let component: PartAttributeComponent;
  let fixture: ComponentFixture<PartAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

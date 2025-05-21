import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatedialogComponent } from './templatedialog.component';

describe('TemplatedialogComponent', () => {
  let component: TemplatedialogComponent;
  let fixture: ComponentFixture<TemplatedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplatedialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

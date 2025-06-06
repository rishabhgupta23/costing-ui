import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatedialogComponent } from './templatedialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule } from '../../config.module';

describe('TemplatedialogComponent', () => {
  let component: TemplatedialogComponent;
  let fixture: ComponentFixture<TemplatedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigModule, HttpClientModule],
      providers: [
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: {} }
    ]
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

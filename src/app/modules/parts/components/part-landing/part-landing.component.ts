import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PART_TABLE_COLUMNS } from '../../../../data/constants/part-table-config.constants';
import { Router } from '@angular/router';
import { PartService } from '../../../../data/services/part/part.service';
import { PartCreateRequest } from '../../../../data/models/part';

@Component({
  selector: 'app-part-landing',
  templateUrl: './part-landing.component.html',
  styleUrl: './part-landing.component.scss'
})
export class PartLandingComponent {
  partList: PartCreateRequest[] = [];
  columns: any[] = PART_TABLE_COLUMNS;
  readonly dialog = inject(MatDialog);

  constructor(private partService: PartService, private router: Router) {
    this.getPartList();
  }

  getPartList() {
     this.partService.getPartList().subscribe(res => {
      this.partList = res.data;
     });
  }

  createPart() {
    this.router.navigateByUrl("/app/parts/create");
  }
    
}

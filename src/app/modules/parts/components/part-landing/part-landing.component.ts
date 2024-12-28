import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PART_TABLE_COLUMNS } from '../../../../data/constants/part-table-config.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-part-landing',
  templateUrl: './part-landing.component.html',
  styleUrl: './part-landing.component.scss'
})
export class PartLandingComponent {
  partList: any[] = [
    {
      partName : "Part 1",
      partNumber: "10001",
      unit: "PCS",
      type: "Master",
      category: "Finished"
    },
    {
      partName : "Part 2",
      partNumber: "10002",
      unit: "KG",
      type: "Unit",
      category: "Semi Finished"
    },
    {
      partName : "Part 3",
      partNumber: "10003",
      unit: "PCS",
      type: "Unit",
      category: "Raw Material"
    }
  ];
  columns: any[] = PART_TABLE_COLUMNS;
  readonly dialog = inject(MatDialog);

  constructor(private router: Router) {
    this.getPartList();
  }

  getPartList() {
    // this.vendorService.getVendorList().subscribe(res => {
    //   this.vendorList = res;
    // });
  }

  createPart() {
    this.router.navigateByUrl("/app/parts/create");
  }
    
}

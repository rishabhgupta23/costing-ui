import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TemplatedialogComponent } from '../templatedialog/templatedialog.component';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { TemplateService } from 'src/app/data/services/part-template/part-template.service';
import { AttributeRow, TemplateListItem, TemplateResponse } from 'src/app/data/models/part-template';
import { PageEvent } from '@angular/material/paginator';
import { getValueOrNull } from 'src/app/shared/utils/string.util';
import { Subject } from 'rxjs';
import { SortIcons } from 'src/app/shared/constants/table.constants';
import { SortState } from 'src/app/data/models/part';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-part-template',
  templateUrl: './part-template.component.html',
  styleUrls: ['./part-template.component.scss']
})
export class PartTemplateComponent implements OnInit {
  partTemplateName: string = '';
  templateList: TemplateListItem[] = [];
  filteredTemplates: TemplateListItem[] = [];
  expandedTemplateMap = new Map<number, TemplateResponse>();
  expandedTemplateId: number | null = null;
  pageSize: number = 100 
currentPage: number = 0;
totalRecords: number=0;
pageInfo: any;
searchTermName: string = ''; 
filterCriteria = new Map<string, string>();
  sortAsc: boolean = true;
  sortState: SortState={sortColumn:'name',sortState:SortIcons.ASC}

  constructor(
    private dialog: MatDialog,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates(): void {
    this.templateService.getTemplateList(
      this.currentPage,
      this.pageSize,
      this.filterCriteria,
      this.sortState
    ).subscribe(res => {
      this.templateList = res.data || [];
      this.filteredTemplates = [...this.templateList];
      this.totalRecords = getValueOrNull(res.pageInfo?.totalRecords);
    });
  }
  

  openAttributeDialog(): void {
    const dialogRef = this.dialog.open(TemplatedialogComponent, {
      width: '600px',
      data: { existingAttributes: new Set(),
        templateName: '', // no name
        isEditMode: false // hide input
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === DialogCloseResponse.UPDATE) {
        const selectedAttributes = result.data as AttributeRow[];
        const selectedAttributeIds = selectedAttributes.map(attr => attr.attributeId);

        const request = {
          name: this.partTemplateName,
          partAttributes: selectedAttributeIds
        };

        this.templateService.createTemplate(request).subscribe({
          next: () => {
            this.partTemplateName = '';
            this.getTemplates();
          }
        });
      }
    });
  }

  toggleExpand(templateId: number): void {
    if (this.expandedTemplateId === templateId) {
      this.expandedTemplateId = null;
    } else {
      this.expandedTemplateId = templateId;
      this.getTemplateDetails(templateId);
    }
  }

  isExpanded(templateId: number): boolean {
    return this.expandedTemplateId === templateId;
  }

  getTemplateDetails(templateId: number): void {
    if (!this.expandedTemplateMap.has(templateId)) {
      this.templateService.getTemplateById(templateId).subscribe(res => {
        this.expandedTemplateMap.set(templateId, res);
      });
    }
  }

  applyFilter(): void {
    if (this.searchTermName) {
      this.filterCriteria.set('name', this.searchTermName.trim());
    } else {
      this.filterCriteria.delete('name');
    }
    this.getTemplates();
  }

  clearFilter(): void {
    this.searchTermName = '';
    this.filterCriteria.delete('name');
    this.getTemplates();
  }
  
  getSortIcon(key: string): string {
    return this.sortState.sortColumn === key ? (this.sortState.sortState === SortIcons.ASC ? SortIcons.ASC : SortIcons.DESC) 
    : SortIcons.DEFAULT;
  }
  
  toggleSort(key: string): void {
    this.sortState = {
      sortColumn: key, sortState: this.sortState.sortColumn !== key ? SortIcons.ASC : 
          this.sortState.sortState === SortIcons.ASC ? SortIcons.DESC : SortIcons.ASC
    };
    this.applySort(this.sortState);
  }

  applySort(sort:SortState): void {
    this.sortState=sort;
    this.getTemplates();
    }
      

    editTemplate(template: TemplateListItem): void {
      const templateId = template.templateId;
    
      this.templateService.getTemplateById(templateId).subscribe(res => {
        const existingAttributes = new Set(res.partAttributes.map(attr => attr.attributeId));
    
        const dialogRef = this.dialog.open(TemplatedialogComponent, {
          width: '600px',
          data: {
            existingAttributes,
            isEditMode: true,
            templateName: res.name
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result?.action === DialogCloseResponse.UPDATE) {
            const selectedAttributes = result.data as AttributeRow[];
            const selectedAttributeIds = selectedAttributes.map(attr => attr.attributeId);
            const updatedName = result.name;
    
            const request = {
              name: updatedName,
              partAttributes: selectedAttributeIds
            };
    
            this.templateService.updateTemplate(templateId, request).subscribe({
              next: () => {
                this.getTemplates();
    
                // Immediately update the expandedTemplateMap to avoid blank accordion
                this.expandedTemplateMap.set(templateId, {
                  templateId,
                  name: updatedName,
                  partAttributes: selectedAttributes
                });
    
                // If this template is expanded, force reload details
                if (this.expandedTemplateId === templateId) {
                  this.getTemplateDetails(templateId);
                }
              },
              error: () => {
                alert('Error updating template');
              }
            });
          }
        });
      });
    }
    
    

    deleteTemplate(template: TemplateListItem): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Delete Template',
          message: `Are you sure you want to delete the template "${template.name}"?`
        }
      });
    
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.templateService.deleteTemplate(template.templateId).subscribe({
            next: () => {
              this.getTemplates();
    
              // Clean up expanded map if deleted template was expanded
              if (this.expandedTemplateId === template.templateId) {
                this.expandedTemplateId = null;
                this.expandedTemplateMap.delete(template.templateId);
              }
            },
            error: () => {
              alert('Error deleting template');
            }
          });
        }
      });
    }
    

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getTemplates();
  }
  
}

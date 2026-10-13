
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CostFactorData } from 'src/app/data/models/part';
import { CostFactorType } from 'src/app/data/constants/cost-factor.constants';

@Component({
  selector: 'app-cost-factor-table',
  templateUrl: './cost-factor-table.component.html',
  styleUrls: ['./cost-factor-table.component.scss']
})
export class CostFactorTableComponent {

  @Input() vendorId!: number;

  @Input() costFactors: CostFactorData[] = [];

  @Output() remove = new EventEmitter<{
    costFactor: CostFactorData;
    vendorId: number;
  }>();

  isCalculatedCostFactor(costFactor: CostFactorData): boolean {
    return costFactor?.factorType === CostFactorType.CALCULATED;
  }

  hasCalculatedCostFactor(): boolean {
    return this.costFactors.some(costFactor =>
      this.isCalculatedCostFactor(costFactor)
    );
  }

  updateCalculatedValue(costFactor: CostFactorData): void {
    if (!this.isCalculatedCostFactor(costFactor)) {
      return;
    }

    if (costFactor.quantity == null || costFactor.rate == null) {
      costFactor.value = 0;
      return;
    }

    costFactor.value =
      Number(costFactor.quantity) * Number(costFactor.rate);
  }

  removeCostFactor(costFactor: CostFactorData): void {
    this.remove.emit({
      costFactor,
      vendorId: this.vendorId
    });
  }
}

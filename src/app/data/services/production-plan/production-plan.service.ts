import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';
import { ProductionCostResponse, ProductionPlanRequest } from '../../models/production-plan';

@Injectable({
  providedIn: 'root'
})
export class ProductionPlanService {

  constructor(private http: HttpClient) { }

  calculateProductionCost(request: ProductionPlanRequest): Observable<ProductionCostResponse> {
    return this.http.post<ProductionCostResponse>(
      ApiUtil.getApiUrl(API_END_POINTS.PRODUCTION_PLAN),
      request
    );
  }


downloadProductionPlan(request: ProductionPlanRequest): Observable<any> {
  const url = ApiUtil.getPreparedUrl(
    API_END_POINTS.PRODUCTION_COST_DOWNLOAD,
    new Map<string, string>()
  );

  return this.http.post<any>(url, request);
}

}

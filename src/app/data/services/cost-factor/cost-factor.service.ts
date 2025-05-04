import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { SortIcons } from '../../../shared/constants/table.constants';
import { SortState } from '../../models/part';

@Injectable({
  providedIn: 'root'
})
export class CostFactorService {
  constructor(private http: HttpClient) {}

  createCostFactor(factorName: string): Observable<any> {
    const params = new HttpParams().set('factorName', factorName);
    const url = ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS_TOOL);
    return this.http.post<any>(url, null, { params });
  }

  getCostFactorList(
    page: number = 0,
    size: number = 100,
    filterCriteria: Map<string, string> = new Map(),
    sortState: SortState = { sortColumn: 'factorName', sortState: SortIcons.ASC }
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', page.toString())
      .set('pageSize', size.toString())
      .set('sortColumn', sortState.sortColumn)
      .set('sortMode', sortState.sortState);

    filterCriteria.forEach((value, key) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    const url = ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS_TOOL);
    return this.http.get<any>(url, { params });
  }

  updateCostFactor(costFactorId: number, factorName: string): Observable<any> {
    const params = new HttpParams()
      .set('costFactorId', costFactorId.toString())
      .set('factorName', factorName);
    const url = ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS_TOOL);
    return this.http.put<any>(url, null, { params });
  }

  deleteCostFactor(costFactorId: number): Observable<any> {
    const pathParams = new Map<string, string>();
    pathParams.set('id', costFactorId.toString()); // ✅ Make sure key is 'id'
    return this.http.delete<any>(ApiUtil.getPreparedUrl(API_END_POINTS.COST_FACTORS_DETAILS, pathParams));
  }
  
  
}

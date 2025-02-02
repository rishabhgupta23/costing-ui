import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CostFactor, PartCreateRequest, PartRow } from '../../models/part';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  updatePart(partId: string, PartCreateRequest: PartCreateRequest): Observable<PartCreateRequest> {
    const params = new Map<string, string>();
    params.set('partId', partId);
    return this.http.post<PartCreateRequest>(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, params), PartCreateRequest);
  }

  getPartById(partId: string): Observable<PartRow> {
    const params = new Map<string, string>();
    params.set('partId', partId);
    return this.http.get<PartRow>(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, params)).pipe(
       map((res: any)=>({
        partId: res?.partId,
        partName: res?.partName,
        partNumber: res?.partNumber,
        categoryName: res?.categoryName,
        type: res?.type,
        unit: res?.unit
        
      })));
  }

  getPartList(page: number = 0, size: number = 100): Observable<any> {
    const url = `${ApiUtil.getApiUrl(API_END_POINTS.PARTS)}?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  deletePart(partId: string): Observable<void> {
    const params = new Map<string, string>();
    params.set('partId', partId);
    return this.http.delete<void>(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, params));
  }


  constructor(private http: HttpClient) { }

  getPartTypes(): Observable<string[]> {
    return this.http.get<string[]>(ApiUtil.getApiUrl(API_END_POINTS.PART_TYPES));
  }

  getPartUnits(): Observable<string[]> {
    return this.http.get<string[]>(ApiUtil.getApiUrl(API_END_POINTS.PART_UNITS));
  }

  getPartCategories(): Observable<string[]> {
    return this.http.get<string[]>(ApiUtil.getApiUrl(API_END_POINTS.CATEGORIES));
  }

  getCostFactors(): Observable<CostFactor[]> {
    return this.http.get<CostFactor[]>(ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS));
  }

  createPart(body: PartCreateRequest) {
    console.log(body);
    return this.http.post<PartCreateRequest>(ApiUtil.getApiUrl(API_END_POINTS.PARTS), body);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CostFactor, CostHistoryResponse, PartCreateRequest, PartDetails, PartRow, SortState } from '../../models/part';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';
import { SortIcons } from '../../../shared/constants/table.constants';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(private readonly http: HttpClient) { }

  updatePart(partId: string, PartCreateRequest: PartCreateRequest): Observable<PartCreateRequest> {
    const params = new Map<string, string>();
    params.set('partId', partId);
    return this.http.post<PartCreateRequest>(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, params), PartCreateRequest);
  }
  getPartById(partId: string): Observable<PartDetails> {
    const params = new Map<string, string>();
    params.set('partId', partId);
    return this.http.get<PartDetails>(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, params));
  }

  getPartList(page: number = 0, size: number = 100, filterCriteria: Map<string, string> = new Map(), sortColumn: string = 'partNumber',sortState={sortColumn:'partNumber', sortState: SortIcons.ASC},
): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', page.toString())
      .set('pageSize', size.toString())
      .set('sortColumn', sortState?.sortColumn)
      .set('sortMode', sortState?.sortState);
  
    filterCriteria.forEach((value, key) => {
      if (value) {
        params = params.set(key, value);
      }
    }); 
    const url = ApiUtil.getApiUrl(API_END_POINTS.PARTS);
    return this.http.get<any>(url, { params });
  }

  deletePart(partId: string): Observable<void> {
    const params = new Map<string, string>();
    params.set('partId', partId);
    return this.http.delete<void>(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, params));
  }

  getPartTypes(): Observable<string[]> {
    return this.http.get<string[]>(ApiUtil.getApiUrl(API_END_POINTS.PART_TYPES));
  }

  getPartUnits(): Observable<string[]> {
    return this.http.get<{ data: { unitId: number; unitName: string }[] }>(ApiUtil.getApiUrl(API_END_POINTS.PART_UNITS)).pipe(
      map(response => response.data.map(unit => unit.unitName))
    );
  }

  getPartCostByPartAndVendor(partId: string, vendorId: number) {
    const params = new HttpParams()
        .set('partId', partId)
        .set('vendorId', vendorId.toString());

    return this.http.get<CostHistoryResponse>(
        ApiUtil.getApiUrl(API_END_POINTS.PART_HISTORY), 
        { params }
    );
}
   getPartCategories(): Observable<Category[]> {
    return this.http.get<any>(ApiUtil.getApiUrl(API_END_POINTS.CATEGORIES)).pipe(
      map((res:any) => res.data)
    );
  }

  getCostFactors(): Observable<CostFactor[]> {
    return this.http.get<CostFactor[]>(ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS)).pipe(
      map((res:any) => res.data)
    );
  }

  createPart(body: PartCreateRequest) {
    console.log(body);
    return this.http.post<PartCreateRequest>(ApiUtil.getApiUrl(API_END_POINTS.PARTS), body);
  }

  downloadExcel() {
    return this.http.get<any>(ApiUtil.getApiUrl(API_END_POINTS.PART_DOWNLOAD));
  }

  downloadBomExcel(partId:string){
    const params = new Map<string, string>();
  params.set('partId', partId);
    return this.http.get<any>(ApiUtil.getPreparedUrl(API_END_POINTS.BOM_DOWNLOAD, params));
  }
}

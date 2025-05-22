import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';
import { PartAttribute, SortState } from '../../models/part';
import { SortIcons } from '../../../shared/constants/table.constants';
import { ListItem } from '../../models/list-items';

@Injectable({
  providedIn: 'root'
})
export class PartAttributeService {
  constructor(private http: HttpClient) {}

  createPartAttribute(attributeName: string): Observable<any> {
    const params = {attributeName};
    return this.http.post<any>(ApiUtil.getApiUrl(API_END_POINTS.PART_ATTRIBUTE), params);
  }

  getPartAttributeList(
    page: number = 0,
    size: number = 100,
    filterCriteria: Map<string, string> = new Map(),
    sortState: SortState = { sortColumn: 'attributeName', sortState: SortIcons.ASC }
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

    const url = ApiUtil.getApiUrl(API_END_POINTS.PART_ATTRIBUTE);
    return this.http.get<any>(url, { params });
  }

  updatePartAttribute(attributeId: number, attributeName: PartAttribute): Observable<PartAttribute> {
    const pathParams = new Map<string, string>();
    pathParams.set('attributeId', attributeId.toString());
    return this.http.put<PartAttribute>(
      ApiUtil.getPreparedUrl(API_END_POINTS.PART_ATTRIBUTE_DETAILS, pathParams),
      attributeName
    );
  }

  deletePartAttribute(attributeId: string): Observable<any> {
    const pathParams = new Map<string, string>();
    pathParams.set('attributeId', attributeId);
    return this.http.delete<any>(ApiUtil.getPreparedUrl(API_END_POINTS.PART_ATTRIBUTE_DETAILS, pathParams));
  }
}

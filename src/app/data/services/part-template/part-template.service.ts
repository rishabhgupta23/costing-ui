import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';
import { SortState } from '../../models/part';
import { SortIcons } from '../../../shared/constants/table.constants';
import { TemplateListItem, TemplateRequest, TemplateResponse } from '../../models/part-template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(private http: HttpClient) {}

  createTemplate(template: TemplateRequest): Observable<any> {
    return this.http.post<any>(ApiUtil.getApiUrl(API_END_POINTS.TEMPLATE), template);
  }

  getTemplateList(
    page: number = 0,
    size: number = 10,
    filterCriteria: Map<string, string> = new Map(),
    sortState: SortState = { sortColumn: 'name', sortState: SortIcons.ASC }
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

    const url = ApiUtil.getApiUrl(API_END_POINTS.TEMPLATE);
    return this.http.get<any>(url, { params });
  }

  updateTemplate(templateId: number, template: TemplateRequest): Observable<TemplateListItem> {
    const pathParams = new Map<string, string>();
    pathParams.set('templateId', templateId.toString());
    return this.http.put<TemplateListItem>(
      ApiUtil.getPreparedUrl(API_END_POINTS.TEMPLATE_DETAILS, pathParams),
      template
    );
  }

  deleteTemplate(templateId: number): Observable<any> {
    const pathParams = new Map<string, string>();
    pathParams.set('templateId', templateId.toString());
    return this.http.delete<any>(
      ApiUtil.getPreparedUrl(API_END_POINTS.TEMPLATE_DETAILS, pathParams)
    );
  }

  getTemplateById(templateId: number): Observable<TemplateResponse> {
    const pathParams = new Map<string, string>();
    pathParams.set('templateId', templateId.toString());
    return this.http.get<TemplateResponse>(
      ApiUtil.getPreparedUrl(API_END_POINTS.TEMPLATE_DETAILS, pathParams)
    );
  }
}

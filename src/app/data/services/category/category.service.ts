import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';
import { SortState } from '../../models/part';
import { SortIcons } from '../../../shared/constants/table.constants';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<any> {
    return this.http.post<any>(ApiUtil.getApiUrl(API_END_POINTS.CATEGORIES), category);
  }

  getCategoryList(
    page: number = 0,
    size: number = 100,
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

    const url = ApiUtil.getApiUrl(API_END_POINTS.CATEGORIES);
    return this.http.get<any>(url, { params });
  }

  updateCategory(categoryId: number, category: Category): Observable<Category> {
    const pathParams = new Map<string, string>();
    pathParams.set('categoryId', categoryId.toString());
    return this.http.put<Category>(ApiUtil.getPreparedUrl(API_END_POINTS.CATEGORIES_DETAILS, pathParams), category);
  }

  deleteCategory(categoryId: string): Observable<any> {
    const pathParams = new Map<string, string>();
    pathParams.set('categoryId', categoryId);
    return this.http.delete<any>(ApiUtil.getPreparedUrl(API_END_POINTS.CATEGORIES_DETAILS, pathParams));
  }

}

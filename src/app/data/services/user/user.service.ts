import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../../models/user';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';
import { SortState } from '../../models/part';
import { SortIcons } from '../../../shared/constants/table.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  whoAmI(): Observable<User> {
    return this.http.get<User>(ApiUtil.getApiUrl(API_END_POINTS.WHO_AM_I));
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(ApiUtil.getApiUrl(API_END_POINTS.LOGIN), body);
  }

    getUserRoles(): Observable<{ roleId: number; roleName: string }[]> {
      return this.http.get<{ data: { roleId: number; roleName: string }[] }>(ApiUtil.getApiUrl(API_END_POINTS.USER_ROLES)).pipe(
        map(response => response.data)
      );
    }

  getUserList(
    page: number = 0,
    size: number = 100,
    filterCriteria: Map<string, string> = new Map(),
    sortState: SortState = { sortColumn: 'displayName', sortState: SortIcons.ASC }
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

    const url = ApiUtil.getApiUrl(API_END_POINTS.GETUSER);

    return this.http.get<any>(url, { params });
  }

  createUser(userData: { emailId: string; password: string; displayName: string; roleId: number }): Observable<User> {
    return this.http.post<User>(ApiUtil.getApiUrl(API_END_POINTS.CREATEUSER), userData)
  }

  deleteUser(userId: number): Observable<void> {
    const params = new Map<string, string>();
    params.set('userId', userId.toString());
    return this.http.delete<void>(ApiUtil.getPreparedUrl(API_END_POINTS.USER_DETAILS, params));
  }

  getUserById(userId: number): Observable<any> {
    const params = new Map<string, string>();
    params.set('userId', userId.toString());
    return this.http.get<any>(ApiUtil.getPreparedUrl(API_END_POINTS.USER_DETAILS, params));
  }

    updateUser(userId: number,  user: Partial<User>): Observable<User> {
      const params = new Map<string, string>();
      params.set('userId', userId.toString());
      return this.http.put<User>(ApiUtil.getPreparedUrl(API_END_POINTS.USER_DETAILS, params), user);
    }

  
  
}

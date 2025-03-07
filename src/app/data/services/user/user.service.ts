import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../../models/user';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';

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
}

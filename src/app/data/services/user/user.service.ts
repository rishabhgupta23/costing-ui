import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  whoAmI(): Observable<User> {
    return this.http.get<User>("http://localhost:8080/whoami");
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>("http://localhost:8080/auth/login", body);
  }
}

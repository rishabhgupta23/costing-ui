import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPartTypes(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl+'/parts/types');
  }

  getPartUnits(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl+'/parts/units');
  }

  getPartCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl+'/categories');
  }
}

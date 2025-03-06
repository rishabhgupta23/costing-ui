import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CostCalculatorService {
    getCost(partId:number,mode:string): Observable<any> {
      
      const url = ApiUtil.getApiUrl(API_END_POINTS.COST_CALCULATE);
      return  this.http.get<any>(url);
    }

  constructor(private http: HttpClient) { }
}

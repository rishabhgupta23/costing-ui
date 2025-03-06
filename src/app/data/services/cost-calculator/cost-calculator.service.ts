import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CostCalculatorService {
    getCost(partId:number,priceMode:string): Observable<any> {

      const params = new Map<string, string>();
      params.set('partId', partId.toString())
      params.set('priceMode', priceMode );
      
      const url = ApiUtil.getPreparedUrl(API_END_POINTS.COST_CALCULATE, params );
      return  this.http.get<any>(url);
    }

  constructor(private http: HttpClient) { }
}

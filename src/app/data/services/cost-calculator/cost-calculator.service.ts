import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostCalculatorService {
    getCost(partId:number,mode:string): Observable<any> {
      const url= `http://localhost:8081/cost/calculate/${partId}?&priceMode=${mode}`;
      return  this.http.get<any>(url);
    }

  constructor(private http: HttpClient) { }
}

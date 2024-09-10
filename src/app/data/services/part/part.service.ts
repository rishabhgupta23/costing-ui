import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CostFactor, PartCreateRequest } from '../../models/part';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(private http: HttpClient) { }

  getPartTypes(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8080/parts/types");
  }

  getPartUnits(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8080/parts/units");
  }

  getPartCategories(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8080/categories");
  }

  getCostFactors(): Observable<CostFactor[]> {
    return this.http.get<CostFactor[]>("http://localhost:8080/parts/cost-factors");
  }

  createPart(body: PartCreateRequest) {
    console.log(body);
    return this.http.post<PartCreateRequest>("http://localhost:8080/parts", body);
  }
}

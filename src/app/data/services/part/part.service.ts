import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CostFactor, PartCreateRequest, PartRow } from '../../models/part';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  updatePart(partId: string, PartCreateRequest: PartCreateRequest): Observable<PartCreateRequest> {
    return this.http.post<PartCreateRequest>(`${'http://localhost:8080/parts'}/${partId}`, PartCreateRequest);
  }

  getPartById(partId: string): Observable<PartRow> {
    return this.http.get<PartRow>(`${'http://localhost:8080/parts'}/${partId}`).pipe(
       map((res: any)=>({
        partId: res?.partId,
        partName: res?.partName,
        partNumber: res?.partNumber,
        categoryName: res?.categoryName,
        type: res?.type,
        unit: res?.unit
        
      })));
  }
  getPartList(page: number = 0, size: number = 100): Observable<any> {
    const url = `http://localhost:8080/parts?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  deletePart(partId: string): Observable<void> {
    return this.http.delete<void>(`/api/parts/${partId}`);
  }


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

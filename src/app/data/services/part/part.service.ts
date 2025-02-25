import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CostFactor, PartCreateRequest, PartDetails, PartRow } from '../../models/part';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  updatePart(partId: string, PartCreateRequest: PartCreateRequest): Observable<PartCreateRequest> {
    return this.http.post<PartCreateRequest>(`${'http://localhost:8080/parts'}/${partId}`, PartCreateRequest);
  }

  getPartById(partId: string): Observable<PartDetails> {
    return this.http.get<PartDetails>(`${'http://localhost:8080/parts'}/${partId}`);
  }
  getPartList(page: number = 0, size: number = 100): Observable<any> {
    const url = `http://localhost:8080/parts?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  deletePart(partId: string): Observable<string> {
    return this.http.delete<string>(`http://localhost:8080/parts/${partId}` );
  }


  constructor(private http: HttpClient) { }

  getPartTypes(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8080/parts/types");
  }

  getPartUnits(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8080/parts/units").pipe(
      map((res:any) => res.data)
    );
  }

  getPartCategories(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8080/categories").pipe(
      map((res:any) => res.data)
    );
  }

  getCostFactors(): Observable<CostFactor[]> {
    return this.http.get<CostFactor[]>("http://localhost:8080/parts/cost-factors").pipe(
      map((res:any) => res.data)
    );
  }

  createPart(body: PartCreateRequest) {
    console.log(body);
    return this.http.post<PartCreateRequest>("http://localhost:8080/parts", body);
  }
}

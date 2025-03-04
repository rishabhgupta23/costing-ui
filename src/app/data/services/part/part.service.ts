import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CostFactor, PartCreateRequest, PartDetails, PartRow } from '../../models/part';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  updatePart(partId: string, PartCreateRequest: PartCreateRequest): Observable<PartCreateRequest> {
    return this.http.post<PartCreateRequest>(`${'http://localhost:8081/parts'}/${partId}`, PartCreateRequest);
  }

  /*getPartList(page: number = 0, size: number = 100,searchTermName: string = '', searchTermNumber: string = ''): Observable<any> {
    const url = `http://localhost:8081/parts?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }
    */

  getParts(page: number = 0, size: number = 100, searchTermName: string = '', searchTermNumber: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('partName', searchTermName)   // Filter by part name
      .set('partNumber', searchTermNumber) // Filter by part number
      .set('pageNo', page.toString())     // Pagination - page number
      .set('pageSize', size.toString());  // Pagination - page size

      const url = `http://localhost:8081/parts?page=${page}&size=${size}&partName=${searchTermName}&partNumber=${searchTermNumber}`;
      return this.http.get<any>(url);
  }

  

  getPartList(page: number = 0, size: number = 100, searchTermName: string = '', searchTermNumber: string = ''): Observable<any> {
    // Construct the URL with search terms and pagination
    const url = `http://localhost:8081/parts?page=${page}&size=${size}&partName=${searchTermName}&partNumber=${searchTermNumber}`;
    return this.http.get<any>(url);
  }
  

  getPartById(partId: string): Observable<PartDetails> {
    return this.http.get<PartDetails>(`${'http://localhost:8081/parts'}/${partId}`);
  }

  

  deletePart(partId: string): Observable<string> {
    return this.http.delete<string>(`http://localhost:8081/parts/${partId}` );
  }


  constructor(private http: HttpClient) { }

  getPartTypes(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8081/parts/types");
  }

  getPartUnits(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8081/parts/units").pipe(
      map((res:any)=>res.data));
  }

  getPartCategories(): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:8081/categories").pipe(
      map((res:any)=>res.data));
  }

  getCostFactors(): Observable<CostFactor[]> {
    return this.http.get<CostFactor[]>("http://localhost:8081/parts/cost-factors").pipe(
      map((res:any)=>res.data));
  }

  createPart(body: PartCreateRequest) {
    console.log(body);
    return this.http.post<PartCreateRequest>("http://localhost:8081/parts", body);
  }
}

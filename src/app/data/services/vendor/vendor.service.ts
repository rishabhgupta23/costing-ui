import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Vendor } from '../../models/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  getVendorById(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${'http://localhost:8080/vendors'}/${vendorId}`);
  }

  updateVendor(vendorId: string, vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(`${'http://localhost:8080/vendors'}/${vendorId}`, vendor);
  }

  constructor(private http: HttpClient) { }

   getVendorParts(vendorId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/vendors/${vendorId}/parts`).pipe(
      map((res:any)=>res.data));
  }
      
  getVendorList(page: number = 0, size: number = 100, filters?: { [key: string]: string }): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', page.toString())
      .set('pageSize', size.toString());
  
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
  
    const url = `http://localhost:8080/vendors?pageNo=${page}&pageSize=${size}`;
    return this.http.get<any>(url, { params });
  }
  

  deleteVendor(vendorId: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/vendors/${vendorId}`);
  }
  

  createVendor(vendor: Vendor): Observable<any> {
    return this.http.post<Vendor>('http://localhost:8080/vendors', vendor);
  }

  downloadExcel() {
    return this.http.get<any>('http://localhost:8080/vendors/download');
  }
}

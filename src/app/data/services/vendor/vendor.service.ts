import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../../models/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  getVendorById(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${'http://localhost:8080/vendors'}/${vendorId}`);
  }

  updateVendor(vendorId: string, vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(`${'http://localhost:8080/vendors'}/${vendorId}`, vendor);
  }

  constructor(private http: HttpClient) { }

  getVendorList(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>('http://localhost:8080/vendors');
  }

  deleteVendor(vendorId: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/vendors/${vendorId}`);
  }
  

  createVendor(vendor: Vendor): Observable<any> {
    return this.http.post<Vendor>('http://localhost:8080/vendors', vendor);
  }
}

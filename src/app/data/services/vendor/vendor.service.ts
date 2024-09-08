import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../../models/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) { }

  getVendorList(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>('http://localhost:8080/vendors');
  }

  createVendor(vendor: Vendor): Observable<any> {
    return this.http.post<Vendor>('http://localhost:8080/vendors', vendor);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../../models/vendor';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getVendorList(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl+'/vendors');
  }

  createVendor(vendor: Vendor): Observable<any> {
    return this.http.post<Vendor>(this.apiUrl+'/vendors', vendor);
  }
}

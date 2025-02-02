import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../../models/vendor';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  getVendorById(vendorId: string): Observable<Vendor> {
    const params = new Map<string, string>();
    params.set('vendorId', vendorId);
    return this.http.get<Vendor>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, params));
  }

  updateVendor(vendorId: string, vendor: Vendor): Observable<Vendor> {
    const params = new Map<string, string>();
    params.set('vendorId', vendorId);
    return this.http.put<Vendor>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, params), vendor);
  }

  constructor(private http: HttpClient) { }

  getVendorList(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(ApiUtil.getApiUrl(API_END_POINTS.VENDORS));
  }

  deleteVendor(vendorId: string): Observable<void> {
    const params = new Map<string, string>();
    params.set('vendorId', vendorId);
    return this.http.delete<void>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, params));
  }
  

  createVendor(vendor: Vendor): Observable<any> {
    return this.http.post<Vendor>(ApiUtil.getApiUrl(API_END_POINTS.VENDORS), vendor);
  }
}

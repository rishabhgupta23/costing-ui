import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  getVendorParts(vendorId: number): Observable<any[]> {
    const pathParams = new Map<string, string>();
    pathParams.set('vendorId', vendorId.toString());
    return this.http.get<any[]>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, pathParams)).pipe(
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
  
    const url = ApiUtil.getApiUrl(API_END_POINTS.VENDORS);
    return this.http.get<any>(url, { params });
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

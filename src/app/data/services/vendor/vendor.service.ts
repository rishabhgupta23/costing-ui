import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Vendor } from '../../models/vendor';
import { ApiUtil } from '../../../shared/utils/api.util';
import { API_END_POINTS } from '../../../config/api.config';
import { SortState } from '../../models/part';
import { SortIcons } from '../../../shared/constants/table.constants';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  getVendorById(vendorId: string): Observable<Vendor> {
    const params = new Map<string, string>();
    params.set('vendorId', vendorId);
    return this.http.get<Vendor>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, params));
  }

  updateVendor(vendorId: string, vendorName: Vendor): Observable<Vendor> {
    const params = new Map<string, string>();
    params.set('vendorId', vendorId);
    return this.http.put<Vendor>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, params), vendorName);
  }

  constructor(private http: HttpClient) { }

  getVendorParts(vendorId: number, page: number =0, size: number=100): Observable<any> {
    const pathParams = new Map<string, string>();
    pathParams.set('vendorId', vendorId.toString());
    let params = new HttpParams()
      .set('pageNo', page.toString())
      .set('pageSize', size.toString());

    return this.http.get<any>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_PARTS, pathParams), {params}).pipe(
      map((res:any)=>res.data));
  }
      
  getVendorList(page: number = 0, size: number = 100, filterCriteria: Map<string, string> = new Map(), sortState: SortState = {sortColumn: 'vendorName', sortState: SortIcons.ASC}): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', page.toString())
      .set('pageSize', size.toString())
      .set('sortColumn', sortState?.sortColumn)
      .set('sortMode', sortState?.sortState);
  
      filterCriteria.forEach((value, key) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    const url = ApiUtil.getApiUrl(API_END_POINTS.VENDORS);
    
    return this.http.get<any>(url, { params });
  }
  

  deleteVendor(vendorId: string): Observable<void> {
    const params = new Map<string, string>();
    params.set('vendorId', vendorId);
    return this.http.delete<void>(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, params));
  }
  

  createVendor(vendorName: Vendor): Observable<any> {
    return this.http.post<Vendor>(ApiUtil.getApiUrl(API_END_POINTS.VENDORS), vendorName);
  }

  downloadExcel() {
    return this.http.get<any>(ApiUtil.getApiUrl(API_END_POINTS.VENDOR_DOWNLOAD));
  }
}

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorService } from './vendor.service';
import { Vendor } from '../../models/vendor';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { SortIcons } from '../../../shared/constants/table.constants';

describe('VendorService', () => {
  let service: VendorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendorService]
    });
    service = TestBed.inject(VendorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve vendor by ID', () => {
    const mockVendor: Vendor = { id: 1, vendorName: 'Vendor A', emailId: '', contactNumber: '', address: '' };
    service.getVendorById('1').subscribe(vendor => {
      expect(vendor).toEqual(mockVendor);
    });
    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, new Map([['vendorId', '1']])));
    expect(req.request.method).toBe('GET');
    req.flush(mockVendor);
  });

  it('should update vendor', () => {
    const mockVendor: Vendor = { id: 1, vendorName: 'Updated Vendor', emailId: '', contactNumber: '', address: '' };
    service.updateVendor('1', mockVendor).subscribe(vendor => {
      expect(vendor).toEqual(mockVendor);
    });
    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, new Map([['vendorId', '1']])));
    expect(req.request.method).toBe('PUT');
    req.flush(mockVendor);
  });

  it('should fetch vendor parts', () => {
    const mockResponse = { data: [{ partId: 1, name: 'Part A' }] };
  
    service.getVendorParts(1).subscribe(parts => {
      expect(parts).toEqual(mockResponse.data);
    });
  
    const expectedUrl = ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_PARTS, new Map([['vendorId', '1']]));
    const req = httpMock.expectOne((request) =>
      request.url === expectedUrl &&
      request.params.get('pageNo') === '0' &&
      request.params.get('pageSize') === '100'
    );
  
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  

  it('should fetch vendor list with filters and sort state', () => {
    const mockResponse = { data: ['vendor1', 'vendor2'] };
    const filterCriteria = new Map([['vendorName', 'Vendor']]);
    const sortState = { sortColumn: 'vendorName', sortState: SortIcons.ASC };

    service.getVendorList(0, 100, filterCriteria, sortState).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('vendors'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('vendorName')).toBe('Vendor');
    expect(req.request.params.get('sortColumn')).toBe('vendorName');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush(mockResponse);
  });

  it('should call getVendorList with default parameters', () => {
    service.getVendorList().subscribe(res => {
      expect(res).toEqual({ data: [], pageInfo: { totalRecords: 0 } });
    });
  
    const req = httpMock.expectOne(req =>
      req.method === 'GET' && req.url === ApiUtil.getApiUrl(API_END_POINTS.VENDORS)
    );
  
    expect(req.request.params.get('pageNo')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('100');
    expect(req.request.params.get('sortColumn')).toBe('vendorName');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush({ data: [], pageInfo: { totalRecords: 0 } });
  });
  

  it('should delete vendor', () => {
    service.deleteVendor('1').subscribe(res => {
      expect(res).toBeNull();
    });
    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.VENDOR_DETAILS, new Map([['vendorId', '1']])));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create vendor', () => {
    const mockVendor: Vendor = { id: 2, vendorName: 'New Vendor', emailId: '', contactNumber: '', address: '' };
    service.createVendor(mockVendor).subscribe(res => {
      expect(res).toEqual(mockVendor);
    });
    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.VENDORS));
    expect(req.request.method).toBe('POST');
    req.flush(mockVendor);
  });

  it('should download Excel', () => {
      service.downloadExcel().subscribe(res => {
        expect(res).toEqual({ success: true });
      });
  
      const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.VENDOR_DOWNLOAD));
      expect(req.request.method).toBe('GET');
      req.flush({ success: true });
    });
});

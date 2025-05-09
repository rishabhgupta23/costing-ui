import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PartService } from './part.service';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { SortIcons } from '../../../shared/constants/table.constants';
import {
  CostFactor,
  CostHistoryResponse,
  PartCreateRequest,
  PartDetails
} from '../../models/part';
import { ListItem } from '../../models/list-items';

describe('PartService', () => {
  let service: PartService;
  let httpMock: HttpTestingController;

  const mockPartId = '123';
  const mockVendorId = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PartService]
    });
    service = TestBed.inject(PartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should update a part', () => {
    const mockRequest: PartCreateRequest = { partNumber: 'P001', partName: 'Test' } as any;
    service.updatePart(mockPartId, mockRequest).subscribe(res => {
      expect(res).toEqual(mockRequest);
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, new Map([['partId', mockPartId]])));
    expect(req.request.method).toBe('POST');
    req.flush(mockRequest);
  });

  it('should get part by ID', () => {
    const mockDetails: PartDetails = { partId: mockPartId, partName: 'Test' } as any;

    service.getPartById(mockPartId).subscribe(res => {
      expect(res).toEqual(mockDetails);
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, new Map([['partId', mockPartId]])));
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });

  it('should call getPartList with sort and search term', () => {
    const filters = new Map([['category', 'Electrical']]);
    service.getPartList(1, 20, filters, 'partName', { sortColumn: 'partName', sortState: SortIcons.ASC }).subscribe(res => {
      expect(res).toEqual({ data: [], pageInfo: { totalRecords: 0 } });
    });
  
    const req = httpMock.expectOne(req =>
      req.method === 'GET' && req.url === ApiUtil.getApiUrl(API_END_POINTS.PARTS)
    );
    expect(req.request.params.get('category')).toBe('Electrical');
    expect(req.request.params.get('pageNo')).toBe('1');
    expect(req.request.params.get('sortColumn')).toBe('partName');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush({ data: [], pageInfo: { totalRecords: 0 } });
  });
  

  it('should delete part by ID', () => {
    service.deletePart(mockPartId).subscribe(res => {
      expect(res).toBeNull();
    });
  
    const req = httpMock.expectOne(
      ApiUtil.getPreparedUrl(API_END_POINTS.PART_DETAILS, new Map([['partId', mockPartId]]))
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
  

  it('should fetch part types', () => {
    service.getPartTypes().subscribe(types => {
      expect(types).toEqual(['Type1', 'Type2']);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.PART_TYPES));
    req.flush(['Type1', 'Type2']);
  });

  it('should fetch part units and map to unit names', () => {
    const response = { data: [{ unitId: 1, unitName: 'Kg' }] };
    service.getPartUnits().subscribe(units => {
      expect(units).toEqual(['Kg']);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.PART_UNITS));
    req.flush(response);
  });

  it('should get cost by part and vendor', () => {
    const mockCostHistory: CostHistoryResponse = { data: [] } as any;
    service.getPartCostByPartAndVendor(mockPartId, mockVendorId).subscribe(res => {
      expect(res).toEqual(mockCostHistory);
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === ApiUtil.getApiUrl(API_END_POINTS.PART_HISTORY));
    expect(req.request.params.get('partId')).toBe(mockPartId);
    expect(req.request.params.get('vendorId')).toBe(mockVendorId.toString());
    req.flush(mockCostHistory);
  });


  it('should get part categories', () => {
    const mockCategories: ListItem[] = [
      { id: 1, name: 'Cat1' },
      { id: 2, name: 'Cat2' }
    ];
    service.getPartCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });
  
    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.CATEGORIES));
    req.flush({ data: mockCategories });
  });
  

  it('should get cost factors', () => {
    const mockFactors: CostFactor[] = [{ id: 1, name: 'Labor' }] as any;
    service.getCostFactors().subscribe(factors => {
      expect(factors).toEqual(mockFactors);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS));
    req.flush({ data: mockFactors });
  });

  it('should create a new part', () => {
    const body: PartCreateRequest = { partNumber: 'P123', partName: 'New Part' } as any;
    service.createPart(body).subscribe(res => {
      expect(res).toEqual(body);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.PARTS));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(body);
  });

  it('should download Excel', () => {
    service.downloadExcel().subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.PART_DOWNLOAD));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true });
  });

  it('should download BOM Excel by partId', () => {
    service.downloadBomExcel(mockPartId).subscribe(res => {
      expect(res).toEqual({ file: 'bom.xlsx' });
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.BOM_DOWNLOAD, new Map([['partId', mockPartId]])));
    expect(req.request.method).toBe('GET');
    req.flush({ file: 'bom.xlsx' });
  });
});

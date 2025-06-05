import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PartAttributeService } from './part-attribute.service';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { SortIcons } from '../../../shared/constants/table.constants';
import { PartAttribute, SortState } from '../../models/part';

describe('PartAttributeService', () => {
  let service: PartAttributeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PartAttributeService]
    });
    service = TestBed.inject(PartAttributeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create part attribute', () => {
    const attributeName = 'Material';
    const expectedResponse = { success: true };

    service.createPartAttribute(attributeName).subscribe(res => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.PART_ATTRIBUTE));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ attributeName });
    req.flush(expectedResponse);
  });

  it('should get part attribute list with filters and sort state', () => {
    const mockResponse = { data: ['attribute1', 'attribute2'] };
    const filterCriteria = new Map([['name', 'Material']]);
    const sortState: SortState = { sortColumn: 'name', sortState: SortIcons.ASC };

    service.getPartAttributeList(0, 100, filterCriteria, sortState).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request => request.url.includes('part-attribute'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('name')).toBe('Material');
    expect(req.request.params.get('sortColumn')).toBe('name');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush(mockResponse);
  });

  it('should get part attribute list with default values', () => {
    const mockResponse = { data: [], pageInfo: { totalRecords: 0 } };

    service.getPartAttributeList().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' && req.url === ApiUtil.getApiUrl(API_END_POINTS.PART_ATTRIBUTE)
    );
    expect(req.request.params.get('pageNo')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('100');
    expect(req.request.params.get('sortColumn')).toBe('attributeName'); // default in service
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush(mockResponse);
  });

  it('should update part attribute', () => {
    const updatedAttribute: PartAttribute = { name: 'Material', value: 'Aluminum' } as any;
    const attributeId = 5;

    service.updatePartAttribute(attributeId, updatedAttribute).subscribe(res => {
      expect(res).toEqual(updatedAttribute);
    });

    const req = httpMock.expectOne(
      ApiUtil.getPreparedUrl(API_END_POINTS.PART_ATTRIBUTE_DETAILS, new Map([['attributeId', attributeId.toString()]]))
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedAttribute);
    req.flush(updatedAttribute);
  });

  it('should delete part attribute', () => {
    const attributeId = '7';

    service.deletePartAttribute(attributeId).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(
      ApiUtil.getPreparedUrl(API_END_POINTS.PART_ATTRIBUTE_DETAILS, new Map([['attributeId', attributeId]]))
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

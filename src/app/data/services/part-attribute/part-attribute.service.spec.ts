import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PartAttributeService } from './part-attribute.service';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { SortIcons } from '../../../shared/constants/table.constants';
import { ListItems } from '../../models/list-items';

fdescribe('PartAttributeService', () => {
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
    const mockAttribute: ListItems = { name: 'Material', value: 'Steel' } as any;

    service.createPartAttribute(mockAttribute).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.PART_ATTRIBUTE));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAttribute);
    req.flush({ success: true });
  });

  it('should get part attribute list with filters and sort state', () => {
    const mockResponse = { data: ['attribute1', 'attribute2'] };
    const filterCriteria = new Map([['name', 'Material']]);
    const sortState = { sortColumn: 'name', sortState: SortIcons.ASC };

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
    service.getPartAttributeList().subscribe(res => {
      expect(res).toEqual({ data: [], pageInfo: { totalRecords: 0 } });
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' && req.url === ApiUtil.getApiUrl(API_END_POINTS.PART_ATTRIBUTE)
    );
    expect(req.request.params.get('pageNo')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('100');
    expect(req.request.params.get('sortColumn')).toBe('name');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush({ data: [], pageInfo: { totalRecords: 0 } });
  });

  it('should update part attribute', () => {
    const mockAttribute: ListItems = { name: 'Material', value: 'Aluminum' } as any;

    service.updatePartAttribute(5, mockAttribute).subscribe(res => {
      expect(res).toEqual(mockAttribute);
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.PART_ATTRIBUTE_DETAILS, new Map([['attributeId', '5']])));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockAttribute);
    req.flush(mockAttribute);
  });

  it('should delete part attribute', () => {
    service.deletePartAttribute('7').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.PART_ATTRIBUTE_DETAILS, new Map([['attributeId', '7']])));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

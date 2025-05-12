import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CostFactorService } from './cost-factor.service';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { SortIcons } from '../../../shared/constants/table.constants';
import { CostFactorItems } from '../../models/list-items';

fdescribe('CostFactorService', () => {
  let service: CostFactorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CostFactorService]
    });
    service = TestBed.inject(CostFactorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a cost factor', () => {
    const mockCostFactor = { id: 1, name: 'New Cost Factor' };

    service.createCostFactor('New Cost Factor').subscribe(res => {
      expect(res).toEqual(mockCostFactor);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS_TOOL));
    expect(req.request.method).toBe('POST');
    req.flush(mockCostFactor);
  });

  it('should get cost factor list with filters and sort state', () => {
    const mockResponse = { data: ['factor1', 'factor2'] };
    const filterCriteria = new Map([['factorName', 'Factor']]);
    const sortState = { sortColumn: 'factorName', sortState: SortIcons.ASC };

    service.getCostFactorList(0, 100, filterCriteria, sortState).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request => request.url.includes('cost-factors'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('factorName')).toBe('Factor');
    expect(req.request.params.get('sortColumn')).toBe('factorName');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush(mockResponse);
  });

  it('should get cost factor list with default values', () => {
    service.getCostFactorList().subscribe(res => {
      expect(res).toEqual({ data: [], pageInfo: { totalRecords: 0 } });
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' && req.url === ApiUtil.getApiUrl(API_END_POINTS.COST_FACTORS_TOOL)
    );
    expect(req.request.params.get('pageNo')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('100');
    expect(req.request.params.get('sortColumn')).toBe('factorName');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush({ data: [], pageInfo: { totalRecords: 0 } });
  });

  it('should update cost factor', () => {
    const mockCostFactor: CostFactorItems = { id: 1, factorName: 'Updated Factor' };

    service.updateCostFactor(1, 'Updated Factor').subscribe(res => {
      expect(res).toEqual(mockCostFactor);
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.COST_FACTORS_DETAILS, new Map([['id', '1']])));
    expect(req.request.method).toBe('PUT');
    req.flush(mockCostFactor);
  });

  it('should delete cost factor', () => {
    service.deleteCostFactor('1').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.COST_FACTORS_DETAILS, new Map([['id', '1']])));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

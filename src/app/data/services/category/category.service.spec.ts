import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { SortIcons } from '../../../shared/constants/table.constants';
import { ListItem } from '../../models/list-items';

fdescribe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create category', () => {
    const mockCategory: ListItem = { id: 1, name: 'Category A' };

    service.createCategory(mockCategory).subscribe(res => {
      expect(res).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.CATEGORIES));
    expect(req.request.method).toBe('POST');
    req.flush(mockCategory);
  });

  it('should get category list with filters and sort state', () => {
    const mockResponse = { data: ['category1', 'category2'] };
    const filterCriteria = new Map([['name', 'Category']]);
    const sortState = { sortColumn: 'name', sortState: SortIcons.ASC };

    service.getCategoryList(0, 100, filterCriteria, sortState).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request => request.url.includes('categories'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('name')).toBe('Category');
    expect(req.request.params.get('sortColumn')).toBe('name');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush(mockResponse);
  });

  it('should get category list with default values', () => {
    service.getCategoryList().subscribe(res => {
      expect(res).toEqual({ data: [], pageInfo: { totalRecords: 0 } });
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' && req.url === ApiUtil.getApiUrl(API_END_POINTS.CATEGORIES)
    );
    expect(req.request.params.get('pageNo')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('100');
    expect(req.request.params.get('sortColumn')).toBe('name');
    expect(req.request.params.get('sortMode')).toBe(SortIcons.ASC);
    req.flush({ data: [], pageInfo: { totalRecords: 0 } });
  });

  it('should update category', () => {
    const mockCategory: ListItem = { id: 1, name: 'Updated Category' };

    service.updateCategory(1, mockCategory).subscribe(res => {
      expect(res).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.CATEGORIES_DETAILS, new Map([['categoryId', '1']])));
    expect(req.request.method).toBe('PUT');
    req.flush(mockCategory);
  });

  it('should delete category', () => {
    service.deleteCategory('1').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.CATEGORIES_DETAILS, new Map([['categoryId', '1']])));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});


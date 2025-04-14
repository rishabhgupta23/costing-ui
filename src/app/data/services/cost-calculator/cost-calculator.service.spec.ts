import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CostCalculatorService } from './cost-calculator.service';

fdescribe('CostCalculatorService', () => {
  let service: CostCalculatorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [CostCalculatorService] 
    });
    service = TestBed.inject(CostCalculatorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getCost and return expected data', () => {
    const mockResponse = {
      costCalcDtoList: [{ partId: 1, cost: 100 }],
      totalCost: 100
    };
  
    const partId = 1;
    const priceMode = 'MIN';
  
    service.getCost(partId, priceMode).subscribe(response => {
      expect(response).toEqual(mockResponse);  // Check if the response is as expected
    });
  
  
    const req = httpMock.expectOne(request => 
      request.method === 'GET' &&  
      request.params.has('priceMode') &&  
      request.params.get('priceMode') === priceMode 
    );
  
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('priceMode')).toBe(priceMode);
  
    req.flush(mockResponse);  
    httpMock.verify();
  });
  

  afterEach(() => {
    httpMock.verify(); 
  });
});

  

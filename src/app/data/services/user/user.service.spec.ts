import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { API_END_POINTS } from '../../../config/api.config';
import { ApiUtil } from '../../../shared/utils/api.util';
import { of } from 'rxjs';
import { User } from '../../models/user';
import { SortIcons } from '../../../shared/constants/table.constants';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call whoAmI and return user data', () => {
    const mockUser: User = { userId: 1, displayName: 'Test User', emailId: 'test@example.com' };

    service.whoAmI().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.WHO_AM_I));
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should call login and return login response', () => {
    const loginRequest = { email: 'test@example.com', password: 'password' };
    const mockResponse = { token: 'mock-token', expiresIn: 3600 };

    service.login(loginRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.LOGIN));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);
    req.flush(mockResponse);
  });

  it('should call getUserList with default sortState and return user list', () => {
    const mockUserList = {
      data: [
        { userId: 1, displayName: 'User A', emailId: 'a@example.com' },
        { userId: 2, displayName: 'User B', emailId: 'b@example.com' }
      ],
      totalCount: 2
    };
  
    const filter = new Map<string, string>();
    filter.set('companyId', '10');
  
    service.getUserList(undefined, undefined,filter).subscribe(response => {
      expect(response).toEqual(mockUserList);
    });
  
    const req = httpMock.expectOne((req) =>
      req.url === ApiUtil.getApiUrl(API_END_POINTS.GETUSER) &&
      req.params.get('pageNo') === '0' &&
      req.params.get('pageSize') === '100' &&
      req.params.get('companyId') === '10' &&
      req.params.get('sortColumn') === 'displayName' &&
      req.params.get('sortMode') === 'ASC'
    );
  
    expect(req.request.method).toBe('GET');
    req.flush(mockUserList);
  });
  
  

  it('should call getUserRoles and return role list', () => {
    const mockRoles = [
      { roleId: 1, roleName: 'Admin' },
      { roleId: 2, roleName: 'User' },
    ];

    service.getUserRoles().subscribe(roles => {
      expect(roles).toEqual(mockRoles);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.USER_ROLES));
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockRoles });
  });

  it('should call createUser and return created user', () => {
    const newUser = { emailId: 'new@example.com', password: 'password123', displayName: 'New User', roleId: 1 };
    const mockCreatedUser: User = { userId: 2, ...newUser };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(mockCreatedUser);
    });

    const req = httpMock.expectOne(ApiUtil.getApiUrl(API_END_POINTS.CREATEUSER));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockCreatedUser);
  });

  it('should call deleteUser and return no content', () => {
    const userId = 1;

    service.deleteUser(userId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.USER_DETAILS, new Map([['userId', '1']])));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
  
  it('should call getUserById and return user data', () => {
    const userId = 1;
    const mockUser: User = { userId, displayName: 'Test User', emailId: 'test@example.com' };

    service.getUserById(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.USER_DETAILS, new Map([['userId', '1']])));
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should call updateUser and return updated user data', () => {
    const userId = 1;

    const userToUpdate: Partial<User> = { 
      displayName: 'Updated User', 
      emailId: 'updated@example.com', 
      roleId: 3 
    };

    const mockUpdatedUser: User = { 
      userId, 
      displayName: userToUpdate.displayName || 'Default Name', 
      emailId: userToUpdate.emailId || 'default@example.com',
      roleId: userToUpdate.roleId || 1  
    };
  
    // Call the updateUser method and assert the result
    service.updateUser(userId, userToUpdate).subscribe(user => {
      expect(user).toEqual(mockUpdatedUser);
    });
  
    // Expect the PUT request with the correct URL and body
    const req = httpMock.expectOne(ApiUtil.getPreparedUrl(API_END_POINTS.USER_DETAILS, new Map([['userId', '1']])));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(userToUpdate);
    req.flush(mockUpdatedUser);
  });
  
});

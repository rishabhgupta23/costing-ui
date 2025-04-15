import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../data/services/user/user.service';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { matFormFieldAnimations, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute:any;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'getUserRoles',
      'getUserById',
      'createUser',
      'updateUser'
    ]);
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['success']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => null
      })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, MatFormFieldModule, MatSelectModule, MatInputModule , NoopAnimationsModule],
      declarations: [UserFormComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    mockUserService.getUserRoles.and.returnValue(of([
      { roleId: 1, roleName: 'Admin' },
      { roleId: 2, roleName: 'User' }
    ]));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user roles on init', () => {
    expect(mockUserService.getUserRoles).toHaveBeenCalled();
    expect(component.userRoles.length).toBe(2);
  });

  it('should initialize form with default values', () => {
    expect(component.userForm.value).toEqual({
      displayName: '',
      emailId: '',
      password: '',
      role: null
    });
  });

  it('should submit new user when no userId is set', () => {
    component.userForm.setValue({
      displayName: 'John',
      emailId: 'john@example.com',
      password: 'test123',
      role: 1
    });

    const userData = {
      displayName: 'John',
      emailId: 'john@example.com',
      password: 'test123',
      roleId: 1
    };

    mockUserService.createUser.and.returnValue(of(userData));

    component.onSubmit();

    expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
    expect(mockSnackbarService.success).toHaveBeenCalledWith('User created successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/users']);
  });

  it('should update user when userId is set', () => {
    component.userId = 99;

    component.userForm.setValue({
      displayName: 'Updated',
      emailId: 'updated@example.com',
      password: 'newpass',
      role: 2
    });

    const updatedUser = {
      displayName: 'Updated',
      emailId: 'updated@example.com',
      password: 'newpass',
      roleId: 2
    };

    mockUserService.updateUser.and.returnValue(of(updatedUser));

    component.onSubmit();

    expect(mockUserService.updateUser).toHaveBeenCalledWith(99, updatedUser);
    expect(mockSnackbarService.success).toHaveBeenCalledWith('User updated successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/users']);
  });

  it('should populate form and disable fields in edit mode', fakeAsync(() => {
    mockActivatedRoute.paramMap = of({
      get: (key: string) => key === 'id' ? '5' : null
    });

    const mockUser = {
      displayName: 'Edit User',
      emailId: 'edit@example.com',
      password: 'secret',
      roleId: 2
    };

    mockUserService.getUserById.and.returnValue(of(mockUser));

    component.ngOnInit();
    tick();

    expect(component.userId).toBe(5);
    expect(mockUserService.getUserById).toHaveBeenCalledWith(5);
    expect(component.userForm.controls.displayName.value).toBe('Edit User');
    expect(component.userForm.controls.displayName.disabled).toBeTrue();
    expect(component.userForm.controls.emailId.disabled).toBeTrue();
    expect(component.userForm.controls.password.disabled).toBeTrue();
  }));
});

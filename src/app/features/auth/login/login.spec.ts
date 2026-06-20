import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoggingService } from '@core/logging.service';
import { USER_ROLES } from '@core/types/user';

import { Login } from './login';
import { LoginApi } from './login-api';

describe('LoginComponent', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  let loginApiSpy: Partial<LoginApi>;
  let routerSpy: Partial<Router>;
  let loggerSpy: Partial<LoggingService>;

  beforeEach(async () => {
    loginApiSpy = {
      login: vi.fn(),
      getDemoCredentials: vi.fn(),
    } as Partial<LoginApi>;

    routerSpy = {
      navigate: vi.fn(),
    } as Partial<Router>;

    loggerSpy = {
      error: vi.fn(),
    } as Partial<LoggingService>;

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: LoginApi, useValue: loginApiSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LoggingService, useValue: loggerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to /dashboard on successful form login', () => {
    const payload = { email: 'a@a.com', password: 'pass' } as any;
    (loginApiSpy.login as any).mockReturnValue(of({} as any));

    component.login(payload);

    expect(loginApiSpy.login as any).toHaveBeenCalledWith(payload);
    expect(routerSpy.navigate as any).toHaveBeenCalledWith(['/dashboard']);
    expect((component as any).loginSource()).toBeNull();
  });

  it('shows error message when login fails', () => {
    const payload = { email: 'bad@a.com', password: 'nope' } as any;
    const err = new Error('bad creds');
    (loginApiSpy.login as any).mockReturnValue(throwError(() => err));

    component.login(payload);

    expect(loginApiSpy.login as any).toHaveBeenCalledWith(payload);
    expect(loggerSpy.error as any).toHaveBeenCalledWith(err);
    expect(routerSpy.navigate as any).not.toHaveBeenCalled();
    expect((component as any).isError()).toBe(true);
    expect((component as any).message()).toBe((component as any).errorMessage);
  });

  it('uses demo credentials and logs in when calling loginAs', () => {
    const demoPayload = { email: 'demo@a.com', password: 'demo' } as any;
    (loginApiSpy.getDemoCredentials as any).mockReturnValue(demoPayload);
    (loginApiSpy.login as any).mockReturnValue(of({} as any));

    component.loginAs(USER_ROLES.Admin as any);

    expect(loginApiSpy.getDemoCredentials as any).toHaveBeenCalledWith(USER_ROLES.Admin);
    expect(loginApiSpy.login as any).toHaveBeenCalledWith(demoPayload);
    expect(routerSpy.navigate as any).toHaveBeenCalledWith(['/dashboard']);
  });
});

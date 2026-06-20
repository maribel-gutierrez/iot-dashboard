import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { LoginForm } from './login-form';

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    fixture.componentRef.setInput('loading', () => false);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit login payload when form submitted with valid inputs', async () => {
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');

    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'secret';
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    vi.spyOn(component.login, 'emit');

    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.login.emit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret',
    });
  });

  it('should show loading state on button when loading is true', () => {
    (component as any).loading = () => true;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
    expect(button.textContent?.trim()).toBe('Loading...');
  });
});

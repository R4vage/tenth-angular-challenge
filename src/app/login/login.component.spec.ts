import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TokenService } from './../core/services/token.service';
import {
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { LoginRestService } from './login-rest.service';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { userLoginMock } from '../mocks/data.mock';


describe('LoginComponent', () => {
  let component: LoginComponent,
    fixture: ComponentFixture<LoginComponent>,
    restService: any,
    tokenService: TokenService,
    debug: DebugElement,
    router: Router;
    const routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'setToken'
    ]);
    const loginRestServiceSpy = jasmine.createSpyObj('LoginRestService', [
      'loginUser',
    ]);
    
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: LoginRestService, useValue: loginRestServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
    })
      .compileComponents()
      .then(() => {
        
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        router = TestBed.inject(Router);
        tokenService = TestBed.inject(TokenService);
        restService = TestBed.inject(LoginRestService);
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', () => {
    const form = debug.queryAll(By.css('#form'));
    expect(form).withContext('The form was not built').toBeTruthy();
  });

  it('should have two inputs', () => {
    const inputs = debug.queryAll(By.css('input'));
    expect(inputs.length).toBe(2);
  });

  it('should trigger login on submit', () => {
    restService.loginUser.and.returnValue(of(userLoginMock));
    const goToHomeSpy = jasmine.createSpy('goToHome');
    component.goToHome = goToHomeSpy;
    let form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    expect(restService.loginUser).toHaveBeenCalled();
    expect(goToHomeSpy).toHaveBeenCalled();
  });

  it('should display wrong email error and disable login button',  () => {
    const emailFromGroup = component.loginForm.get('email');
    const loginButton = debug.query(By.css('#submit-button'))
    emailFromGroup?.setValue('saraza');
    emailFromGroup?.markAsTouched();
    fixture.detectChanges();
    const errors = emailFromGroup?.errors;
    const matError = debug.query(By.css('#error-email'));
    expect(errors?.['pattern'])
      .withContext('No pattern error in reactive form')
      .toBeTruthy();
    expect(matError).withContext('No Material error displayed').toBeTruthy();
    expect(loginButton.nativeElement.disabled).toBe(true)
  });

  it('should have errors and disable login button if no input', () => {
    const form = component.loginForm;
    const loginButton = debug.query(By.css('#submit-button'))
    const emailInput = form.get('email');
    const passwordInput = form.get('password');
    emailInput?.markAsTouched();
    passwordInput?.markAsTouched();
    fixture.detectChanges();
    const matErrors = debug.queryAll(By.css('.mat-error-required'))
    expect(emailInput?.errors?.['required'])
      .withContext('No email input required error')
      .toBeTruthy();
    expect(passwordInput?.errors?.['required'])
      .withContext('No password input required error')
      .toBeTruthy();
    expect(matErrors.length).withContext('Material errors werent displayed').toBe(2)
    expect(loginButton.nativeElement.disabled).toBe(true)
  });

  it('should navigate to main on goToHome call', () => { 
    component.goToHome();
    expect (routerSpy.navigate).toHaveBeenCalledWith(['main']);
  });

  it('should have submit button working if inputs are valid', () => {
    restService.loginUser.and.returnValue(of(userLoginMock))
    const form = component.loginForm;
    const loginButton = debug.query(By.css('#submit-button'))
    const emailInput = form.get('email');
    const passwordInput = form.get('password');
    emailInput?.setValue('mock@mock.com');
    passwordInput?.setValue('mockMock');
    fixture.detectChanges();
    expect(loginButton.nativeElement.disabled).toBeFalse();
    loginButton.nativeElement.click();
    expect(restService.loginUser).toHaveBeenCalled();
  })
});

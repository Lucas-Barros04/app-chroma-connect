import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordPage } from './forgot-password.page';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;
  let firebaseServiceMock: any;
  let utilidadesServiceMock: any;

  beforeEach(async () => {
    firebaseServiceMock = {
      sendRecoveryEmail: jasmine.createSpy('sendRecoveryEmail').and.returnValue(Promise.resolve()),
    };

    utilidadesServiceMock = {
      loading: jasmine.createSpy('loading').and.returnValue(Promise.resolve({ present: jasmine.createSpy(), dismiss: jasmine.createSpy() })),
      presentToast: jasmine.createSpy('presentToast'),
      routerLink: jasmine.createSpy('routerLink'),
    };

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordPage],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: UtilidadesService, useValue: utilidadesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success message and reset form on valid email submission', async () => {
    component.form.setValue({ email: 'test@example.com' });

    await component.submit();

    expect(firebaseServiceMock.sendRecoveryEmail).toHaveBeenCalledWith('test@example.com');
    expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith('Correo enviado', 'primary', 'mail-outline');
    expect(utilidadesServiceMock.routerLink).toHaveBeenCalledWith('/sign-in');
    expect(component.form.value).toEqual({ email: '' });
  });

  it('should show error message on invalid email submission', async () => {
    firebaseServiceMock.sendRecoveryEmail.and.returnValue(Promise.reject({ message: 'Email not found' }));
    component.form.setValue({ email: 'invalid@example.com' });

    await component.submit();

    expect(firebaseServiceMock.sendRecoveryEmail).toHaveBeenCalledWith('invalid@example.com');
    expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith('este correo no existeEmail not found', 'danger', 'alert-circle-outline');
  });

  it('should not call Firebase service if form is invalid', async () => {
    component.form.setValue({ email: '' });

    await component.submit();

    expect(firebaseServiceMock.sendRecoveryEmail).not.toHaveBeenCalled();
    expect(utilidadesServiceMock.presentToast).not.toHaveBeenCalledWith('Correo enviado', 'primary', 'mail-outline');
  });

  it('should show an error toast if form is invalid', async () => {
    component.form.setValue({ email: '' });

    await component.submit();

    expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith('Complete todos los campos', 'danger', 'alert-circle-outline');
  });
});


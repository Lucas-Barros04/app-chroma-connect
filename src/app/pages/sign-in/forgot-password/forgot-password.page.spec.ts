import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ForgotPasswordPage } from './forgot-password.page';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { SharedModule } from '../shared/shared.module';

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
      imports: [SharedModule],
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
  
  it('should not call Firebase service if form is invalid', async () => {
    component.form.setValue({ email: '' });

    await component.submit();

    expect(firebaseServiceMock.sendRecoveryEmail).not.toHaveBeenCalled();
    expect(utilidadesServiceMock.presentToast).not.toHaveBeenCalledWith('Correo enviado', 'primary', 'mail-outline');
  });
  
});


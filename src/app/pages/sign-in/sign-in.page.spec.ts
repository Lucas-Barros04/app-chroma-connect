import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInPage } from './sign-in.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('SignInPage', () => {
  let component: SignInPage;
  let fixture: ComponentFixture<SignInPage>;
  let firebaseServiceMock: any;
  let utilidadesServiceMock: any;

  beforeEach(async () => {
    firebaseServiceMock = {
      signIn: jasmine.createSpy('signIn').and.returnValue(Promise.resolve({ user: { uid: 'testUid' } })),
      getDocument: jasmine.createSpy('getDocument').and.returnValue(Promise.resolve({ name: 'Test User' })),
    };

    utilidadesServiceMock = {
      loading: jasmine.createSpy('loading').and.returnValue(Promise.resolve({ present: jasmine.createSpy(), dismiss: jasmine.createSpy() })),
      presentToast: jasmine.createSpy('presentToast'),
      saveLocalStorage: jasmine.createSpy('saveLocalStorage'),
      routerLink: jasmine.createSpy('routerLink'),
    };

    await TestBed.configureTestingModule({
      declarations: [SignInPage],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: UtilidadesService, useValue: utilidadesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signIn and getUserInfo on valid form submission', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'password123' });

    await component.submit();

    expect(firebaseServiceMock.signIn).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(firebaseServiceMock.getDocument).toHaveBeenCalledWith('users/testUid');
    expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith('Bienvenido Test User', 'primary', 'person-outline');
    expect(utilidadesServiceMock.routerLink).toHaveBeenCalledWith('/main');
  });

  it('should show an error toast if signIn fails', async () => {
    firebaseServiceMock.signIn.and.returnValue(Promise.reject('Sign in failed'));
    component.form.setValue({ email: 'test@example.com', password: 'password123' });

    await component.submit();

    expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith('Tu correo o contraseña estan erroneos', 'danger', 'alert-circle-outline');
  });

  it('should show an error toast if form is invalid', async () => {
    component.form.setValue({ email: '', password: '' });

    await component.submit();

    expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith('Complete todos los campos', 'danger', 'alert-circle-outline');
  });

  it('should reset the form after successful login', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'password123' });

    await component.submit();

    expect(component.form.value).toEqual({ email: '', password: '' });
  });
});


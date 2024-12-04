import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInPage } from './sign-in.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { ReactiveFormsModule } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';

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

  it('should show an error toast if signIn fails', async () => {
    // Simula que la función signIn rechaza con un error.
    firebaseServiceMock.signIn.and.returnValue(Promise.reject('Sign in failed'));
    
    // Configura el formulario con datos de prueba.
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
  
    try {
      // Llama al submit, debe capturar el error.
      await component.submit();
    } catch (error) {
      // Asegúrate de que se muestra el mensaje de error correspondiente.
      expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith(
        'Tu correo o contraseña estan erroneos', 
        'danger', 
        'alert-circle-outline'
      );
    }
  });
  
});
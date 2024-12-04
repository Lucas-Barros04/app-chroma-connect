import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpPage } from './sign-up.page';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { of } from 'rxjs';

describe('SignUpPage', () => {
  let component: SignUpPage;
  let fixture: ComponentFixture<SignUpPage>;
  let firebaseServiceMock: jasmine.SpyObj<FirebaseService>;
  let utilidadesServiceMock: jasmine.SpyObj<UtilidadesService>;

  beforeEach(async () => {
    // Mock de servicios
    firebaseServiceMock = jasmine.createSpyObj('FirebaseService', ['signUp', 'updateUser', 'setDocument']);
    utilidadesServiceMock = jasmine.createSpyObj('UtilidadesService', ['loading', 'presentToast', 'saveLocalStorage', 'routerLink']);

    await TestBed.configureTestingModule({
      declarations: [ SignUpPage ],
      imports: [ ReactiveFormsModule ], // Aseguramos que ReactiveFormsModule esté importado
      providers: [
        FormBuilder,
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: UtilidadesService, useValue: utilidadesServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se haya creado exitosamente
  });
});



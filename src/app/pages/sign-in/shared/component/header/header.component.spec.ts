import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let utilServiceMock: jasmine.SpyObj<UtilidadesService>;

  beforeEach(async () => {
    // Creamos un mock de UtilidadesService
    utilServiceMock = jasmine.createSpyObj('UtilidadesService', ['closeModal']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: UtilidadesService, useValue: utilServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detener el ciclo de detección de cambios
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with title, backButton, and isModal inputs', () => {
    component.title = 'Test Title';
    component.backButton = 'back-button';
    component.isModal = true;

    fixture.detectChanges();

    expect(component.title).toBe('Test Title');
    expect(component.backButton).toBe('back-button');
    expect(component.isModal).toBeTrue();
  });

  it('should call closeModal on the utilService when closeModal is called', () => {
    // Simulamos que se llama a closeModal()
    component.closeModal();
    
    // Verificamos que se haya llamado al método closeModal() del servicio
    expect(utilServiceMock.closeModal).toHaveBeenCalled();
  });
});


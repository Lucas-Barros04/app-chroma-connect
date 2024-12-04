import { TestBed } from '@angular/core/testing';
import { guardNoLoginGuard } from './guard-no-login.guard';
import { FirebaseService } from '../services/firebase.service';
import { UtilidadesService } from '../services/utilidades.service';

describe('guardNoLoginGuard', () => {
  let mockFirebaseService: any;
  let mockUtilidadesService: any;

  beforeEach(() => {
    mockFirebaseService = {
      getAuth: jasmine.createSpy().and.returnValue({
        onAuthStateChanged: jasmine.createSpy(),
      }),
    };

    mockUtilidadesService = {
      routerLink: jasmine.createSpy('routerLink'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: UtilidadesService, useValue: mockUtilidadesService },
      ],
    });
  });

  it('should create the guard successfully', () => {
    // Simplemente verifica que el guard es una función válida
    expect(typeof guardNoLoginGuard).toBe('function');
  });
});



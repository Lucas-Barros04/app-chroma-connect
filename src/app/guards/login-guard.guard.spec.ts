import { TestBed } from '@angular/core/testing';
import { loginGuardGuard } from './login-guard.guard';
import { FirebaseService } from '../services/firebase.service';
import { UtilidadesService } from '../services/utilidades.service';

describe('loginGuardGuard', () => {
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
    // Verifica que el guard es una función
    expect(typeof loginGuardGuard).toBe('function');
  });
  
});

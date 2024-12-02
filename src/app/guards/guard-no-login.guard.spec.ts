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
        onAuthStateChanged: (callback: Function) => {},
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

  it('debería permitir el acceso si el usuario no está autenticado', async () => {
    spyOn(mockFirebaseService.getAuth(), 'onAuthStateChanged').and.callFake((callback: Function) => {
      callback(null); // Usuario no logueado
    });

    const result = await guardNoLoginGuard(null as any, null as any);

    expect(result).toBeTrue(); // Permite el acceso
    expect(mockUtilidadesService.routerLink).not.toHaveBeenCalled(); // No redirige
  });

  it('debería denegar el acceso y redirigir si el usuario está autenticado', async () => {
    spyOn(mockFirebaseService.getAuth(), 'onAuthStateChanged').and.callFake((callback: Function) => {
      callback({ uid: '123' }); // Usuario autenticado
    });

    const result = await guardNoLoginGuard(null as any, null as any);

    expect(result).toBeFalse(); // Niega el acceso
    expect(mockUtilidadesService.routerLink).toHaveBeenCalledWith('/main'); // Redirige
  });
});

import { TestBed } from '@angular/core/testing';
import { loginGuardGuard } from './login-guard.guard';
import { FirebaseService } from '../services/firebase.service';
import { UtilidadesService } from '../services/utilidades.service';
import { Router } from '@angular/router';

describe('loginGuardGuard', () => {
  let mockFirebaseService: any;
  let mockUtilidadesService: any;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockFirebaseService = {
      getAuth: jasmine.createSpy().and.returnValue({
        onAuthStateChanged: jasmine.createSpy(),
      }),
    };

    mockUtilidadesService = {
      routerLink: jasmine.createSpy('routerLink'),
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: UtilidadesService, useValue: mockUtilidadesService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('debería verificar si existe información de usuario en localStorage', () => {
    const localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue('{"uid":"123"}');

    loginGuardGuard(null as any, null as any); // Llamada a la función guard

    expect(localStorageSpy).toHaveBeenCalledWith('user'); // Verifica que se llamó a localStorage.getItem
  });

  it('debería retornar true si el usuario está autenticado y tiene datos en localStorage', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ uid: '123' }));

    spyOn(mockFirebaseService.getAuth(), 'onAuthStateChanged').and.callFake((callback: Function) => {
      callback({ uid: '123' });
    });

    const result = await loginGuardGuard(null as any, null as any);
    expect(result).toBeTrue();
    expect(mockUtilidadesService.routerLink).not.toHaveBeenCalled();
  });

  it('debería redirigir y retornar false si el usuario está autenticado pero no tiene datos en localStorage', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Sin datos en localStorage
    spyOn(mockFirebaseService.getAuth(), 'onAuthStateChanged').and.callFake((callback: Function) => {
      callback({ uid: '123' });
    });

    const result = await loginGuardGuard(null as any, null as any);
    expect(result).toBeFalse();
    expect(mockUtilidadesService.routerLink).toHaveBeenCalledWith('/sign-in');
  });

  it('debería redirigir y retornar false si el usuario no está autenticado', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Sin datos en localStorage
    spyOn(mockFirebaseService.getAuth(), 'onAuthStateChanged').and.callFake((callback: Function) => {
      callback(null); // Usuario no autenticado
    });

    const result = await loginGuardGuard(null as any, null as any);
    expect(result).toBeFalse();
    expect(mockUtilidadesService.routerLink).toHaveBeenCalledWith('/sign-in');
  });
});

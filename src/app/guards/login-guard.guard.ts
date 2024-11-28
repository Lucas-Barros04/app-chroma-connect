import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilidadesService } from '../services/utilidades.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const utilService = inject(UtilidadesService);

  // Verificar si existe información de usuario almacenada
  const user = localStorage.getItem('user');

  return new Promise<boolean>((resolve) => {
    firebaseService.getAuth().onAuthStateChanged((auth) => {
      if (auth) {
        if (user) {
          // Usuario autenticado y con datos en localStorage, permitir acceso
          resolve(true);
        } else {
          // Usuario autenticado pero sin datos en localStorage (caso inconsistente)
          utilService.routerLink('/sign-in');
          resolve(false);
        }
      } else {
        // Usuario no autenticado, redirigir a la pantalla de inicio de sesión
        utilService.routerLink('/sign-in');
        resolve(false);
      }
    });
  });
};


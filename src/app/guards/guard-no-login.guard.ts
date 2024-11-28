import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilidadesService } from '../services/utilidades.service';

export const guardNoLoginGuard: CanActivateFn = (route, state) => {
  const fireBase = inject(FirebaseService);
  const utilService = inject(UtilidadesService);

  return new Promise<boolean>((resolve) => {
    fireBase.getAuth().onAuthStateChanged((auth) => {
      if (!auth) {
        // Usuario no logueado
        resolve(true);
      } else {
        // Usuario logueado
        utilService.routerLink('/main');
        resolve(false);
      }
    });
  });
};



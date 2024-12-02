import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilidadesService } from '../services/utilidades.service';
import { inject } from '@angular/core';

export const guardNoLoginGuard: CanActivateFn = (route, state) => {
  const fireBase = inject(FirebaseService);
  const utilService = inject(UtilidadesService);

  return new Promise<boolean>((resolve) => {
    fireBase.getAuth().onAuthStateChanged((auth) => {
      if (!auth) {
        resolve(true); // Usuario no logueado
      } else {
        utilService.routerLink('/main'); // Usuario logueado, redirige
        resolve(false);
      }
    });
  });
};





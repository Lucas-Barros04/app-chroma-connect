import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private toast: ToastController, private router: Router) { }
  loadingCTRL = inject(LoadingController)

  loading(){
    return this.loadingCTRL.create({spinner: 'bubbles'})
  }
   //=================toast===========

   async presentToast(mensaje: string, color : string) {
    const toast = await this.toast.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'middle',
      icon: 'alert-circle-outline'
    })
    toast.present();
  }

  routerLink(ruta: string){
    return this.router.navigateByUrl(ruta);

  }
}

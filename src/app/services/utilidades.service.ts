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

   async presentToast(mensaje: string, color : string, position: any, icon: string) {
    const toast = await this.toast.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: position,
      icon: icon
    })
    toast.present();
  }

  routerLink(ruta: string){
    return this.router.navigateByUrl(ruta);

  }

  saveLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }

  getLocalStorage(key: string, value: any){
    return JSON.parse( localStorage.getItem(key));
  }
}

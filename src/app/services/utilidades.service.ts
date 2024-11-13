import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, ModalController, ModalOptions } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private toast: ToastController, private router: Router, private modalCtrl: ModalController) { }
  loadingCTRL = inject(LoadingController)

  

  async takePicture(promptLabelHeader: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: "Selecciona una imagem",
    promptLabelPicture: "Toma la foto"
  });

  
};

  loading(){
    return this.loadingCTRL.create({spinner: 'bubbles'})
  }
   //=================toast===========

   async presentToast(mensaje: string, color : string, icon: string) {
    const toast = await this.toast.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'middle',
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

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
  
    await modal.present();

    const {data} = await modal.onWillDismiss(); //obtener datos que devuelve la modal cuando se cierra.
    if(data){
      return data
    };
  };

  closeModal(data?: any ){
    return this.modalCtrl.dismiss(data)
  }
}

import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { AddPhotoComponent } from '../../sign-in/shared/add-photo/add-photo.component';
import { User } from 'src/app/models/user.models';
import { Photos } from 'src/app/models/photos.models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  nombreUsuario: string = '';
  nombreApellido: string = '';
  photoProfile: string = '';

  photos: Photos[] = []; //hacer tipado para fotos(interfaze)

  postCount: number = 0;

  followingCount: number = 0;

  followersCount: number = 0;

  constructor(
    private fireBase: FirebaseService,
    private utilService: UtilidadesService
  ) {}

  ngOnInit() {
    const usuarioString = localStorage.getItem('user');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.nombreUsuario = usuario.username;
      this.nombreApellido = usuario.name;
      this.photoProfile = usuario.photoProfile;
    }

    let pathFollowing = `users/${this.user().uid}/following`;

    let sub = this.fireBase.getCollectionData(pathFollowing).subscribe({
      next: (res: any) => {
        this.followingCount = res.length;
        sub.unsubscribe; //tener control de la peticion
      },
    });

    let pathFollowers = `users/${this.user().uid}/followers`;

    let sub2 = this.fireBase.getCollectionData(pathFollowers).subscribe({
      next: (res: any) => {
        this.followersCount = res.length;
        sub.unsubscribe; //tener control de la peticion
      },
    });
  }

  signOut() {
    this.fireBase.signOut();
    localStorage.removeItem('user');
  }

  //subir fotos
  uploadPhotos() {
    this.utilService.presentModal({
      component: AddPhotoComponent,
    });
  }

  user(): User {
    return this.utilService.getLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getGaleryPhotos(); //ejecuta una funcion cada vez que el user entra en la pagina "profile"
  }

  //obtener todas las fotos creadas y guardadas en firebase
  getGaleryPhotos() {
    let path = `users/${this.user().uid}/galery`;

    let sub = this.fireBase.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.photos = res;
        this.postCount = res.length;
        sub.unsubscribe; //tener control de la peticion
      },
    });
  }


  async addUpdatePhoto(photo?: Photos) {
    //los signos de ? dicen que el parametro no es requerido
    let exitoso = await this.utilService.presentModal({
      component: AddPhotoComponent,
      componentProps: { photo },
    });
    if (exitoso) {
      this.getGaleryPhotos;
    }
  }

  async confirmDeletePhoto(photo: Photos) {
    this.utilService.presentAlert({
      header: 'Eliminar producto',
      subHeader: 'Subtitle',
      message: '¿Deseas eliminar este producto permanentemente?',
      buttons: [{
        text: 'Cancelar'
      },{
        text: 'Aceptar',
        handler: () =>{
          this.deletePhoto(photo)
        }
      }]
    });
  
  }


  async deletePhoto(photo: Photos) {
    let path = `users/${this.user().uid}/galery/${photo.id}`;

    const loading = await this.utilService.loading();
    await loading.present();

    let imgPath = await this.fireBase.getFilePath(photo.imagen);
    await this.fireBase.deleteFile(imgPath);

    this.fireBase
      .deleteDocument(path)
      .then(async (res) => {
        this.photos = this.photos.filter(p => p.id !== photo.id) //devuelvbe la lista de fotos sin la foto que le pase
        this.utilService.presentToast(
          'Se borro el post con existo',
          'success',
          'check-circle-outline'
        );
      })
      .catch((error) => {
        this.utilService.presentToast(
          'Ocurrio un error al borrar: ' + error,
          'danger',
          'alert-circle-outline'
        );
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}

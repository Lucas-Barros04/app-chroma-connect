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

  comments: any[] = [];
  photos: Photos[] = []; //hacer tipado para fotos(interfaze)

  notifications: any;
  postCount: number = 0;

  unreadNotificationsCount: number = 0;

  followingCount: number = 0;

  followersCount: number = 0;

  constructor(
    private fireBase: FirebaseService,
    private utilService: UtilidadesService
  ) {}

  ngOnInit() {

  }

  pathUser(){
    this.nombreUsuario = this.user().username
    this.nombreApellido = this.user().name
    this.photoProfile = this.user().photoProfile
  }

  pathFollowin(){
    //usar la base de datos para el nombre apellido y la foto de perfil
    let pathFollowing = `users/${this.user().uid}/following`;
  
    let sub = this.fireBase.getCollectionData(pathFollowing).subscribe({
      next: (res: any) => {
        this.followingCount = res.length;
        sub.unsubscribe(); // Asegúrate de invocar el método unsubscribe correctamente
      },
    });
  }

  pathFollower(){
    let pathFollowers = `users/${this.user().uid}/followers`;

     let sub2 = this.fireBase.getCollectionData(pathFollowers).subscribe({
      next: (res: any) => {
        this.followersCount = res.length;
        sub2.unsubscribe(); //tener control de la peticion
      },
    });
  }
  

  signOut() {
    this.nombreUsuario = '';
    this.nombreApellido = '';
    this.photoProfile = '';
    this.fireBase.signOut();
    localStorage.removeItem('user');
  }

  async confirmsignOut() {
    this.utilService.presentAlert({
      header: '¿Deseas cerrar sesión?',
      message: `¿Estás seguro que deseas cerrar sesión? ${this.user().username}`,
      buttons: [{
        text: 'Cancelar'
      },{
        text: 'Aceptar',
        handler: () =>{
          this.signOut()
        }
      }]
    });
  
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
    this.getGaleryPhotos();
    this.pathFollower(); //ejecuta una funcion cada vez que el user entra en la pagina "profile"
    this.pathFollowin();
    this.pathUser();
    this.getNotifications();
  }

  getComments(photoId: string) {
    let pathComments = `users/${this.user().uid}/galery/${photoId}/comments`;

    let sub = this.fireBase.getCollectionData(pathComments).subscribe({
      next: (res: any) => {
        // Guardamos los comentarios de la foto en la propiedad correspondiente
        this.comments[photoId] = res;
        sub.unsubscribe(); // Terminamos la suscripción después de recibir los datos
      },
      error: (err) => {
        console.error('Error al obtener los comentarios:', err);
      }
    });
  }

  //obtener todas las fotos creadas y guardadas en firebase
  getGaleryPhotos() {
    let path = `users/${this.user().uid}/galery`;

    let sub = this.fireBase.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.photos = res;
        this.postCount = res.length;

        // Por cada foto, obtenemos los comentarios
        this.photos.forEach(photo => {
          this.getComments(photo.id);
        });
        
        sub.unsubscribe(); //tener control de la peticion
      },
    });
  }

    async updateProfilePhoto() {
      let wait;
      try {
        
        // Abrir cámara o galería
        const imageBase64 = (await this.utilService.takePicture('Actualizar foto de perfil')).dataUrl;
        
        if (imageBase64 == null) {
          this.utilService.presentToast(
            'No se seleccionó ninguna imagen.',
            'warning',
            'alert-circle-outline'
          );
          return;
        }
        wait = await this.utilService.loading();
        await wait.present();
        // Subir imagen a Firebase Storage
        const storagePath = `users/${this.user().uid}/profilePhoto.jpg`; // Ruta para la foto de perfil
        const imageUrl = await this.fireBase.uploadImg(storagePath, imageBase64);
    
        // Actualizar el campo en Firestore
        const userPath = `users/${this.user().uid}`;
        await this.fireBase.updateDocument(userPath, { photoProfile: imageUrl })
    
        // Actualizar la imagen localmente
        
        this.photoProfile = imageUrl;
    
        // Mostrar mensaje de éxito
        this.utilService.presentToast(
          'Foto de perfil actualizada con éxito.',
          'success',
          'checkmark-circle-outline'
        );
        
      } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        this.utilService.presentToast(
          'Hubo un problema al actualizar la foto de perfil.',
          'danger',
          'close-circle-outline'
        );
      } finally{
        wait.dismiss();
      } 
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

  getNotifications() {
    let path = `users/${this.user().uid}/notifications`;
  
    let sub = this.fireBase.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.notifications = res;
        sub.unsubscribe();
      },
      error: (err) => {
        console.error('Error al obtener las notificaciones:', err);
      },
    });
  }

  markAsRead(notificationId: string) {
    let path = `users/${this.user().uid}/notifications/${notificationId}`;
  
    this.fireBase.updateDocument(path, { seen: true })
      .then(() => {
        this.notifications = this.notifications.map(notification => 
          notification.id === notificationId ? { ...notification, seen: true } : notification
        );
        this.unreadNotificationsCount--;
      })
      .catch(err => {
        console.error('Error al marcar como leída:', err);
      });
  }
  
  deleteNotification(notificationId: string) {
    const path = `notifications/${notificationId}`; // Ruta de la notificación
    this.fireBase.deleteDocument(path)
      .then(() => {
        // Aquí puedes actualizar el estado de la interfaz de usuario, por ejemplo:
        this.notifications = this.notifications.filter(notification => notification.id !== notificationId);
        this.utilService.presentToast('Notificación eliminada con éxito', 'success', 'checkmark-circle-outline');
      })
      .catch(error => {
        console.error('Error al eliminar la notificación:', error);
        this.utilService.presentToast('Hubo un problema al eliminar la notificación', 'danger', 'alert-circle-outline');
      });
  }
  
  
  
}

import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { AddPhotoComponent } from '../../sign-in/shared/add-photo/add-photo.component';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  nombreUsuario: string = '';

  photos: [];    //hacer tipado para producto(interfaze)

  constructor(private fireBase: FirebaseService, private utilService: UtilidadesService) { }

  ngOnInit() {
    const usuarioString = localStorage.getItem('user');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.nombreUsuario = usuario.username;
    }

  }

  signOut(){
    this.fireBase.signOut();
    localStorage.removeItem('user')
  }

  //subir fotos
  uploadPhotos(){
    this.utilService.presentModal({
      component: AddPhotoComponent
    })
  }

  user():User{
    return this.utilService.getLocalStorage('user')
  }

  ionViewWillEnter() {
    this.getGaleryPhotos(); //ejecuta una funcion cada vez que el user entra en la pagina "profile"
  }

  
  getGaleryPhotos(){
    let path = `users/${this.user().uid}/galery`;

    let sub = this.fireBase.getCollectionData(path).subscribe({
      next: (res: any)=>{
        console.log(res)
        sub.unsubscribe;   //tener control de la peticion 
      }
    })
  }

  
  
  
  
}

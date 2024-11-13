import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { AddPhotoComponent } from '../../sign-in/shared/add-photo/add-photo.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  nombreUsuario: string = '';

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

  
  
  
  
}

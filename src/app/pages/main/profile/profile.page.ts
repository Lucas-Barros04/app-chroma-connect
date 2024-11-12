import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  nombreUsuario: string = '';

  constructor(private fireBase: FirebaseService) { }

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

  
  
  
  
}

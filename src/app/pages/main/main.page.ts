import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private utilService: UtilidadesService, private fireBase: FirebaseService) { }

  ngOnInit() {
  }

  signOut(){
    this.fireBase.signOut()
  }
}

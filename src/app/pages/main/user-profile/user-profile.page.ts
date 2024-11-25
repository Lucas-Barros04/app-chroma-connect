import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Photos } from 'src/app/models/photos.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  userId: string | null = null;
  userData: any;
  photos: Photos[] = []; 
  postCount: number = 0;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
     // Capturar el ID del usuario desde la URL
     this.userId = this.route.snapshot.paramMap.get('id');

     if (this.userId) {
       // Obtener los datos del usuario desde Firebase
       this.firebaseService.getDocument(`users/${this.userId}`).then((data: User) => {
         this.userData = data;
         //obtenemos las foto del usuario
         let path = `users/${this.userId}/galery`;
         let sub = this.firebaseService.getCollectionData(path).subscribe({
          next: (res: any) => {
            this.photos = res;
            this.postCount = res.length;
            sub.unsubscribe; //tener control de la peticion
          },
        });
       });
     }
     
  }

  

}

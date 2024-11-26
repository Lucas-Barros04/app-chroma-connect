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
  currentUserId: string | null = null;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
     // Capturar el ID del usuario desde la URL
     this.userId = this.route.snapshot.paramMap.get('id');
     this.currentUserId = JSON.parse(localStorage.getItem('user')).uid; //obtener solo el id del user

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
  async toggleLike(photo: Photos) {
    if (!photo.id || !this.userId) return;
  
    const photoPath = `users/${this.userId}/galery/${photo.id}`;
  
    // Asegúrate de que 'likedBy' sea un arreglo
    if (!photo.likedBy) photo.likedBy = [];
    
    // Verificar si el usuario actual ya ha dado like
    const index = photo.likedBy.indexOf(this.currentUserId);
  
    if (index === -1) {
      // El usuario no ha dado like, agregarle el like
      photo.likedBy.push(this.currentUserId);
      photo.likes += 1;  // Incrementamos el contador de likes
    } else {
      // El usuario ya ha dado like, quitarle el like
      photo.likedBy.splice(index, 1);
      photo.likes -= 1;  // Decrementamos el contador de likes
    }
  
    // Actualizar el campo de likes y likedBy en Firebase
    await this.firebaseService.updateDocument(photoPath, {
      likes: photo.likes,
      likedBy: photo.likedBy,
    }).then(() => {
      console.log('Likes actualizados');
    }).catch(err => {
      console.error('Error al actualizar los likes:', err);
    });
  }

  

}

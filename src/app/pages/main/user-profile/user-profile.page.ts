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
  isFollowing: boolean = false;
  followersCount: number = 0;
  followingCount: number = 0;
  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
     // Capturar el ID del usuario desde la URL
     this.userId = this.route.snapshot.paramMap.get('id');
     this.currentUserId = JSON.parse(localStorage.getItem('user')).uid; //obtener solo el id del user

     if (this.userId && this.currentUserId) {
      // Verificar si ya sigue al usuario
      const followingPath = `users/${this.currentUserId}/following/${this.userId}`;
      this.firebaseService.getDocument(followingPath).then((data) => {
        if(data){
          this.isFollowing = true;
        }else{
          this.isFollowing = false;
        }
      });
    }

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
     //seguidores
     const followersPath = `users/${this.userId}/followers/`;
     let sub = this.firebaseService.getCollectionData(followersPath).subscribe({
      next: (res: any) => {
        this.followersCount = res.length;
        sub.unsubscribe; //tener control de la peticion
      },
    });

    //siguiendo
    const followingPath = `users/${this.userId}/following/`;
     let sub2 = this.firebaseService.getCollectionData(followingPath).subscribe({
      next: (res: any) => {
        this.followingCount = res.length;
        sub.unsubscribe; //tener control de la peticion
      },
    });

  }
  async toggleLike(photo: Photos) {
    if (!photo.id || !this.userId) return; //si vienen indefinidos o null no pasa
  
    const photoPath = `users/${this.userId}/galery/${photo.id}`;
  
    // Asegúrate de que 'likedBy' sea un arreglo, verificar en el modelo tambien, se crea el arreglo
    if (!photo.likedBy) photo.likedBy = [];
    
    // Verificar si el usuario actual ya ha dado like, si no lo encuentra devuelve -1
    const index = photo.likedBy.indexOf(this.currentUserId);
  
    if (index === -1) {
      // El usuario no ha dado like, agregarle el like
      photo.likedBy.push(this.currentUserId);
      photo.likes += 1;  // Incrementamos el contador de likes
    } else {
      // El usuario ya ha dado like, quitarle el like, busca su posicion y lo cambia a primer lugar
      photo.likedBy.splice(index, 1);
      photo.likes -= 1;  // Decrementamos el contador de likes
    }
  
    // Actualizar el campo de likes y likedBy en Firebase
    await this.firebaseService.updateDocument(photoPath, {
      likes: photo.likes,
      likedBy: photo.likedBy,
    }).then(() => {
    }).catch(err => {
      console.error('Error al actualizar los likes:', err);
    });
  }

  async followUser() {
    if (!this.userId || !this.currentUserId) return;
  
    // Rutas de los documentos a seguir
    const followingPath = `users/${this.currentUserId}/following/${this.userId}`;
    const followersPath = `users/${this.userId}/followers/${this.currentUserId}`;
  
    // Verificar si ya sigue al usuario
    const userFollowing = await this.firebaseService.getDocument(followingPath);
    if (!userFollowing) {
      // Si no lo sigue, agregarlo (crear un documento en la subcolección)
      await this.firebaseService.setDocument(followingPath, { followed: true });
  
      // Agregar al usuario a la lista de seguidores (crear un documento en la subcolección)
      await this.firebaseService.setDocument(followersPath, { follower: true });
  
      this.isFollowing = true;
      console.log('Ahora sigues a este usuario');
    } else {
      console.log('Ya estás siguiendo a este usuario');
    }
  }
  
  async unfollowUser() {
    if (!this.userId || !this.currentUserId) return;
  
    // Rutas de los documentos a dejar de seguir
    const followingPath = `users/${this.currentUserId}/following/${this.userId}`;
    const followersPath = `users/${this.userId}/followers/${this.currentUserId}`;
  
    // Eliminar la relación de seguimiento (eliminar documento de la subcolección)
    await this.firebaseService.deleteDocument(followingPath);
  
    // Eliminar al usuario de la lista de seguidores (eliminar documento de la subcolección)
    await this.firebaseService.deleteDocument(followersPath);
  
    this.isFollowing = false;
    console.log('Dejaste de seguir a este usuario');
  }
  

}

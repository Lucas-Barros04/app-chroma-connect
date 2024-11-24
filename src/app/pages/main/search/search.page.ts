import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchText: string = ''; // Texto ingresado en el buscador
  users: any[] = []; // Resultados de la búsqueda

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

  searchUsers(event: any): void {
    const queryText = event.target.value; //cuando se escriba en el input, el target hace referencia al elemento y value muestra
                                          // el valor del target

    if (queryText.trim() === '') { //si vienen espacio los cambia por nada
      this.users = []; // Vaciar resultados si no hay texto
      return;
    }

    // Llamar al método para buscar usuarios
    this.firebaseService.getUsersByUsername(queryText).subscribe({
      next: (data)=>{
        this.users = data
      }
    })
  }

  viewUserProfile(user: User): void {
    console.log('Usuario seleccionado:', user);
    // Navegar al perfil del usuario
    // this.router.navigate(['/profile', user.id]); en proceso de creacion
  }
}

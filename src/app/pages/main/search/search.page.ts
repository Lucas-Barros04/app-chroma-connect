import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchText: string = ''; // Texto ingresado en el buscador
  users: any[] = []; // Resultados de la búsqueda

  constructor(private firebaseService: FirebaseService, private utilService: UtilidadesService) { }

  router = inject(Router)

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

  async viewUserProfile(user: User): Promise<void> {
    const loading = await this.utilService.loading(); // Obtiene el loader del servicio
    await loading.present();

    this.router.navigate(['main', 'user-profile', user.uid]).then(()=>{
      loading.dismiss()
    })
  }
}

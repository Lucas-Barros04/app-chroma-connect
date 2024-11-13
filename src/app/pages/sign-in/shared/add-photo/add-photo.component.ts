import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
})
export class AddPhotoComponent  implements OnInit {

  form = new FormGroup({
    descripcion : new FormControl('',[Validators.required, Validators.minLength(1)]),
    imagen : new FormControl('', [Validators.required]),
    name : new FormControl('', [Validators.required, Validators.minLength(1)])
  })

  constructor(private fireBaseService: FirebaseService, private utilidadesService: UtilidadesService ) { }

  ngOnInit() {
  }

  async takeImg(){
    const dataUrl = (await this.utilidadesService.takePicture("Fotografía")).dataUrl
    this.form.controls.imagen.setValue(dataUrl)
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilidadesService.loading();
      await loading.present();

      // this.fireBaseService
      //   .signUp(this.form.value as User)
      //   .then(async (res) => {
      //     await this.fireBaseService.updateUser(this.form.value.name);

      //     let uid = res.user.uid;

      //     console.log(res);
      //   })
      //   .catch((error) => {
      //     this.utilidadesService.presentToast(
      //       'Ocurrios un error al crear el usuario: ' + error,
      //       'danger',
      //       'alert-circle-outline'
      //     );
      //   })
      //   .finally(() => {
      //     loading.dismiss();
      //   });
      // ahora hay que mandar todo esto a firebase
    }
  }

  
}



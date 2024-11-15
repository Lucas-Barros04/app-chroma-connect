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
export class AddPhotoComponent implements OnInit {
  form = new FormGroup({
    id : new FormControl(''),
    descripcion: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    imagen: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private fireBaseService: FirebaseService,
    private utilidadesService: UtilidadesService
  ) {}

  user = {} as User;

  ngOnInit() {
    this.user = this.utilidadesService.getLocalStorage('user');
  }

  async takeImg() {
    const dataUrl = (await this.utilidadesService.takePicture('Fotografía'))
      .dataUrl;
    this.form.controls.imagen.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {
      let path = `users/${this.user.uid}/galery`;

      const loading = await this.utilidadesService.loading();
      await loading.present();

      let dataUrl = this.form.value.imagen;

      let imgPath = `${this.user.uid}/${Date.now()}`;

      let imageUrl = await this.fireBaseService.uploadImg(imgPath, dataUrl);

      this.form.controls.imagen.setValue(imageUrl);

      delete this.form.value.id

      this.fireBaseService
        .addDocument(path, this.form.value)
        .then(async (res) => {

          this.utilidadesService.closeModal({ success: true});

          this.utilidadesService.presentToast(
            'Se subio la foto con existo',
            'success',
            'check-circle-outline'
          );
        })
        .catch((error) => {
          this.utilidadesService.presentToast(
            'Ocurrios un error al crear el usuario: ' + error,
            'danger',
            'alert-circle-outline'
          );
        })
        .finally(() => {
          loading.dismiss();
        });
      // ahora hay que mandar todo esto a firebase
    }
  }
}

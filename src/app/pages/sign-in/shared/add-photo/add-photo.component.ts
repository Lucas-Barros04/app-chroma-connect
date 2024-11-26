import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { User } from 'src/app/models/user.models';
import { Photos } from 'src/app/models/photos.models';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
})
export class AddPhotoComponent implements OnInit {
  @Input() photo: Photos;

  form = new FormGroup({
    likes: new FormControl(null),
    id: new FormControl(''),
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
    if(this.photo) this.form.setValue(this.photo);
  }

  async takeImg() {
    const dataUrl = (await this.utilidadesService.takePicture('Fotografía'))
      .dataUrl;
    this.form.controls.imagen.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.photo) this.updatePhoto();
      else this.createPhoto();
    }
  }

  async createPhoto() {
    
      let path = `users/${this.user.uid}/galery`;

      const loading = await this.utilidadesService.loading();
      await loading.present();

      let dataUrl = this.form.value.imagen;

      let imgPath = `${this.user.uid}/${Date.now()}`;

      let imageUrl = await this.fireBaseService.uploadImg(imgPath, dataUrl);

      this.form.controls.imagen.setValue(imageUrl);

      delete this.form.value.id;

      this.fireBaseService
        .addDocument(path, this.form.value)
        .then(async (res) => {
          this.utilidadesService.closeModal({ success: true });
          this.utilidadesService.presentToast(
            'Se subio la foto con existo',
            'success',
            'checkmark-circle-outline'
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
    
  }

  async updatePhoto() {
    
      let path = `users/${this.user.uid}/galery/${this.photo.id}`;

      const loading = await this.utilidadesService.loading();
      await loading.present();
      //si cambia imagen, subir nueva y obtener url
      if (this.form.value.imagen !== this.photo.imagen) {
        let dataUrl = this.form.value.imagen;

        let imgPath = await this.fireBaseService.getFilePath(this.photo.imagen);

        let imageUrl = await this.fireBaseService.uploadImg(imgPath, dataUrl);

        this.form.controls.imagen.setValue(imageUrl);
      }

      delete this.form.value.id;

      this.fireBaseService
        .updateDocument(path, this.form.value)
        .then(async (res) => {
          this.utilidadesService.closeModal({ success: true });

          this.utilidadesService.presentToast(
            'Se actualizo el post con existo',
            'success',
            'check-circle-outline'
          );
        })
        .catch((error) => {
          this.utilidadesService.presentToast(
            'Ocurrio un error al actualizar: ' + error,
            'danger',
            'alert-circle-outline'
          );
        })
        .finally(() => {
          loading.dismiss();
        });
    }

  }


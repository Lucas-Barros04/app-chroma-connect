import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email, this.emailDuocValidator()]),
    password: new FormControl('', [Validators.required]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{8}$/),
      Validators.maxLength(8),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    photoProfile: new FormControl('assets/icon/favicon.png')
  });

  constructor(
    private fireBaseService: FirebaseService,
    private utilidadesService: UtilidadesService
  ) {}

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilidadesService.loading();
      await loading.present();

      this.fireBaseService
        .signUp(this.form.value as User)
        .then(async (res) => {
          await this.fireBaseService.updateUser(this.form.value.name);

          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);

          this.setUserInfo(uid)

          console.log(res);
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
  }

  emailDuocValidator() {
    return (control: FormControl) => {
      const email = control.value;
      if (email && !email.endsWith('@duocuc.cl')) {
        return { invalidEmailDomain: true }; // Error específico
      }
      return null; // Validación correcta
    };
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilidadesService.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.fireBaseService
        .setDocument(path, this.form.value)
        .then(async (res) => {
          this.utilidadesService.saveLocalStorage('user', this.form.value);
          this.utilidadesService.routerLink('/sign-in');
          this.utilidadesService.presentToast(
            'Usuario creado exitosamente',
            'primary',
            'checkmark-circle-outline'
          );
          this.form.reset;
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
  }
}

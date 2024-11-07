import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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
        .sendRecoveryEmail(this.form.value.email)
        .then((res) => {
          console.log(res);
          this.form.reset
        })
        .catch((error) => {
          this.utilidadesService.presentToast(
            'Tu correo o contraseña estan erroneos',
            'danger',
            'midle',
            'alert-circle-outline'
          );
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
  catch(error: string) {
    this.utilidadesService.presentToast(
      'Complete todos los campos',
      'danger',
      'midle',
      'alert-circle-outline'
    );
    console.log(error);
  }
}

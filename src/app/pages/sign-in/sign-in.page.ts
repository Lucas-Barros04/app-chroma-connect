import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  form = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email,this.emailDuocValidator()]),
    password : new FormControl('', [Validators.required])
  })
  constructor(private fireBaseService: FirebaseService, private utilidadesService: UtilidadesService ) { }

  ngOnInit() {
  }
  async submit(){
    if(this.form.valid){
      const loading = await this.utilidadesService.loading();
      await loading.present();

    this.fireBaseService.signIn(this.form.value as User).then(res=> {
      console.log(res)
      
      this.getUserInfo(res.user.uid)
    }).catch(error => {
      this.utilidadesService.presentToast(
        'Tu correo o contraseña estan erroneos', 
        'danger',
        'alert-circle-outline'
      )
    }).finally(() => {
      loading.dismiss();
    })
    }
  }catch(error:string){
    this.utilidadesService.presentToast(
      'Complete todos los campos',
      'danger',
      'alert-circle-outline'
    )
    console.log(error);
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

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilidadesService.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.fireBaseService
        .getDocument(path)
        .then((user: User) => {
          this.utilidadesService.saveLocalStorage('user', user);
          this.utilidadesService.routerLink('/main');
          this.form.reset();
          this.utilidadesService.presentToast(
            `Bienvenido ${user.name}`,
            'primary',
            'person-outline'
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
  }
}
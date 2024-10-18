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
    email : new FormControl('',[Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required]),
    username : new FormControl('', [Validators.required, Validators.minLength(4)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
    name : new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  constructor(private fireBaseService: FirebaseService, private utilidadesService: UtilidadesService) { }

  ngOnInit() {
  }

  async submit(){
    if(this.form.valid){
      const loading = await this.utilidadesService.loading();
      await loading.present();

      this.fireBaseService.signUp(this.form.value as User).then(res =>{
        console.log(res)
        this.utilidadesService.routerLink('/main')
      }).catch(error => {
        this.utilidadesService.presentToast('Ocurrios un error al crear el usuario: '+error,'danger')
      }).finally(() =>{
        loading.dismiss();
      })
    }
  }
}

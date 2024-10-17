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
    email : new FormControl('',[Validators.required, Validators.email]),
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
    }).catch(error => {
      this.utilidadesService.presentToast('ocurrio un error' + error, 'danger')
    }).finally(() => {
      loading.dismiss();
    })
    }
  }
}

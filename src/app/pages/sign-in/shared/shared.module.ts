import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { LogoComponent } from './component/logo/logo.component';
import { InputComponent } from './component/input/input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [HeaderComponent, LogoComponent, InputComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule ],
  exports: [HeaderComponent, LogoComponent, InputComponent, ReactiveFormsModule]
})
export class SharedModule { }

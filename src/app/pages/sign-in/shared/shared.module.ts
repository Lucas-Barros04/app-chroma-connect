import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { LogoComponent } from './component/logo/logo.component';
import { InputComponent } from './component/input/input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPhotoComponent } from './add-photo/add-photo.component';




@NgModule({
  declarations: [HeaderComponent, LogoComponent, InputComponent, AddPhotoComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule ],
  exports: [HeaderComponent, LogoComponent, InputComponent, ReactiveFormsModule, AddPhotoComponent]
})
export class SharedModule { }

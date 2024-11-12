import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.models';
import {getFirestore, setDoc, doc, getDoc} from '@angular/fire/firestore'
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);

  firestore = inject(AngularFirestore);

  utilService = inject(UtilidadesService)

  //=======autenticacion

  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //================register
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user')
    this.utilService.routerLink('/sign-in')
  }

  //============actualizar user
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, { displayName })
  }

  
  //==============recuperar contraseña
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email)
  }

  //================base de datos
  setDocument(paht: string, data: any){
    return setDoc(doc(getFirestore(),paht), data);
  }
  
  async getDocument(paht: string){
    return (await (getDoc(doc(getFirestore(), paht)))).data();
  }
}

import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.models';
import {getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query} from '@angular/fire/firestore'
import { UtilidadesService } from 'src/app/services/utilidades.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage, uploadString, ref, getDownloadURL} from 'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);

  firestore = inject(AngularFirestore);

  utilService = inject(UtilidadesService)

  storage = inject(AngularFireStorage)

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

  addDocument(paht: string, data: any){
    return addDoc(collection(getFirestore(),paht), data);
  }

  async uploadImg(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(),path))
    })
  }

  getCollectionData(paht: string, collectionQuery?: any){ //? = no requerido
    const refDataBase = collection(getFirestore(),paht);
    return collectionData(query(refDataBase, collectionQuery), {idField:'id'});
  }
}

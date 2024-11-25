import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.models';
import {getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc, where} from '@angular/fire/firestore'
import { UtilidadesService } from 'src/app/services/utilidades.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage, uploadString, ref, getDownloadURL, deleteObject} from 'firebase/storage'

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

  updateDocument(paht: string, data: any){
    return updateDoc(doc(getFirestore(),paht), data);
  }

  deleteDocument(paht: string){
    return deleteDoc(doc(getFirestore(),paht));
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

  ///////////////////////////////////////////////
  getUsersByUsername(searchText: string) {
     
    const path = 'users'; // ruta de la colección de usuarios en tu base de datos Firestore.
    //Obtén una referencia a la colección desde Firestore.
    const refDataBase = collection(getFirestore(), path);
    //Crea una consulta para buscar usuarios según el "username".
    const queryByUsername = query(
      refDataBase,
      where('username', '>=', searchText), // Filtra los usernames que sean mayores o iguales a "searchText".
      where('username', '<=', searchText + '\uf8ff') // Filtra hasta los usernames que empiezan con "searchText" y asegura que incluya cualquier texto.
    );
    return collectionData(queryByUsername, { idField: 'id' });//obtener datos encontrados y mas el id
    // El parámetro `{ idField: 'id' }` agrega el ID del documento a cada objeto devuelto.
  }

  //usando almacenamiento de firebase

  getCollectionData(paht: string, collectionQuery?: any){ //? = no requerido
    const refDataBase = collection(getFirestore(),paht); //obtener todos los datos de la ruta especificada
    return collectionData(query(refDataBase, collectionQuery), {idField:'id'});
  }

  async getFilePath(url: string){ //obtener ruta de la imagen para actualizarla en caso de que ususariop desee
    return ref(getStorage(), url).fullPath
  }

  deleteFile(path: string){
    return deleteObject(ref(getStorage(),path))
  }
}

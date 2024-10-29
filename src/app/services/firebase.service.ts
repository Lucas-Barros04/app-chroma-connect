import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.models';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);

  firestore = inject(AngularFirestore);

  //=======autenticacion

  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //================register
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
}

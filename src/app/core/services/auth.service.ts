import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebaseAuthService: AngularFireAuth) {}

  public async signInWithEmailAndPassword(email: string, password: string) {
    const response = await this.firebaseAuthService.signInWithEmailAndPassword(
      email,
      password
    );
    return response.user;
  }

  public async signInWithGoogle() {
    const response = await this.firebaseAuthService.signInWithPopup(
      new GoogleAuthProvider()
    );
    return response.user;
  }

  public signUp(email: string, password: string) {
    return this.firebaseAuthService.createUserWithEmailAndPassword(
      email,
      password
    );
  }
}

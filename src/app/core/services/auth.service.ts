import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private firebaseAuthService: AngularFireAuth,
    private usersService: UsersService
  ) {}

  public getCurrentUser(): Observable<User | null> {
    return new Observable<User | null>((observer) => {
      this.firebaseAuthService.onAuthStateChanged((user) => {
        if (user) {
          this.usersService.getUserByFirebaseId(user.uid).subscribe({
            next: (user) => {
              observer.next(user);
            },
            error: (error) => {
              observer.error(error);
            },
          });
        } else {
          observer.next(null);
        }
      });
    });
  }

  public async signInWithEmailAndPassword(email: string, password: string) {
    const response = await this.firebaseAuthService.signInWithEmailAndPassword(
      email,
      password
    );
    return response.user;
  }

  public async signInWithGoogle(): Promise<User> {
    const response = await this.firebaseAuthService.signInWithPopup(
      new GoogleAuthProvider()
    );
    return new Promise((resolve, reject) => {
      if (response.user) {
        this.usersService.getUserByFirebaseId(response.user.uid).subscribe({
          next: (user) => {
            if (!user) {
              this.usersService
                .createUser({
                  name: response.user?.displayName?.split(' ')[0] as string,
                  lastName:
                    (response.user?.displayName?.split(' ')[1] as string) ||
                    'Unknown',
                  nickname: response.user?.displayName as string,
                  email: response.user?.email as string,
                  isConnected: true,
                  firebaseUID: response.user?.uid as string,
                  photoURL: response.user?.photoURL as string,
                })
                .subscribe({
                  next: (user) => {
                    resolve(user);
                  },
                });
            }
            resolve(user);
          },
          error: (error) => {
            reject(error);
          },
        });
      } else {
        reject('Error al iniciar sesión con Google');
      }
    });
  }

  public signUp(email: string, password: string) {
    return this.firebaseAuthService.createUserWithEmailAndPassword(
      email,
      password
    );
  }

  public signOut() {
    return this.firebaseAuthService.signOut();
  }
}

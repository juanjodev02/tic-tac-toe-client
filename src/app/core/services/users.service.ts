import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  public getConnectedUsers(userId: string) {
    return new Observable<User[]>((observer) => {
      this.httpClient
        .get<User[]>(`${environment.apiBaseUrl}/users/${userId}/connected`)
        .subscribe({
          next: (users) => {
            observer.next(users);
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  public getUserByFirebaseId(firebaseUid: string) {
    return new Observable<User>((observer) => {
      this.httpClient
        .get<User>(
          `${environment.apiBaseUrl}/users/${firebaseUid}?firebaseId=${true}`
        )
        .subscribe({
          next: (user) => {
            observer.next(user);
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  public createUser(user: User) {
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/users`, user);
  }
}

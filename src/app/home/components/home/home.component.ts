import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { User } from 'src/app/core/models/User';
import { AuthService } from 'src/app/core/services/auth.service';
import { GamesService } from 'src/app/core/services/games.service';
import { UsersService } from 'src/app/core/services/users.service';
import { UsersSocket } from 'src/app/sockets/UsersSocket';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  connectedUsers: User[] = [];
  currentUserId?: string;
  isLoadingConnectedUsers: boolean = true;
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private userSocket: UsersSocket,
    private gamesService: GamesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUsers();

    this.userSocket.fromEvent('user-connected').subscribe(() => {
      this.fetchUsers();
    });

    this.userSocket.fromEvent('user-disconnected').subscribe(() => {
      this.fetchUsers();
    });
  }

  fetchUsers() {
    this.authService
      .getCurrentUser()
      .pipe(
        switchMap((user) => {
          this.currentUserId = user?.id;
          return this.usersService.getConnectedUsers(user?.id as string);
        })
      )
      .subscribe({
        next: (connectedUsers) => {
          this.connectedUsers = connectedUsers;
          this.isLoadingConnectedUsers = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoadingConnectedUsers = false;
        },
      });
  }

  onRequestGame(user: User) {
    this.gamesService
      .requestGame(this.currentUserId as string, user.id as string)
      .subscribe({
        next: (game) => {
          console.log('game', game);
          this.router.navigate(['/game', game.id]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}

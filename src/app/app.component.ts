import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { RequestGameDialogComponent } from './components/request-game-dialog/request-game-dialog.component';
import { Game } from './core/models/Game';
import { User } from './core/models/User';
import { AuthService } from './core/services/auth.service';
import { UsersSocket } from './sockets/UsersSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  items = [
    {
      title: 'Profile',
      icon: 'person',
      link: '/profile',
    },
    { title: 'Log out', icon: 'log-out-outline', link: '/sign-out' },
  ];
  today = new Date();
  isLoading = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersSocket: UsersSocket,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.isLoading = false;
    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        this.usersSocket.disconnect();
        this.currentUser = null;
        this.router.navigate(['/sign-in']);
        return;
      }
      this.currentUser = user;

      this.usersSocket.emit('register-user-connection', {
        userId: this.currentUser.id,
      });

      this.usersSocket.on('connect', () => {
        if (this.currentUser) {
          this.usersSocket.emit('register-user-connection', {
            userId: this.currentUser.id,
          });
        }
      });
      // reconnect
      this.usersSocket.on('reconnect', () => {
        if (this.currentUser) {
          this.usersSocket.emit('register-user-connection', {
            userId: this.currentUser.id,
          });
        }
      });

      this.usersSocket.on('game-request-received', (game: Game) => {
        const incomingPlayer = game.players.find(
          (player) => player.id !== this.currentUser?.id
        );
        this.dialogService.open(RequestGameDialogComponent, {
          context: {
            game,
            currentUserId: this.currentUser?.id,
            incomingPlayer,
          },
        });
      });
    });

    this.usersSocket.on('game-rejected', (game: Game) => {
      this.toastrService.show('Juego rechazado!', '', {
        status: 'danger',
      });
      this.router.navigate(['/']);
    });
  }
}

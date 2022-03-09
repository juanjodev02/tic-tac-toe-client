import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { switchMap, zip } from 'rxjs';
import { Game } from 'src/app/core/models/Game';
import { AuthService } from 'src/app/core/services/auth.service';
import { GamesService } from 'src/app/core/services/games.service';
import { UsersSocket } from 'src/app/sockets/UsersSocket';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game | null = null;

  currentUserId?: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gamesService: GamesService,
    private authService: AuthService,
    private usersSocket: UsersSocket
  ) {}

  ngOnInit(): void {
    zip(
      this.activatedRoute.params.pipe(
        switchMap((params) => this.gamesService.getGame(params['id']))
      ),
      this.authService.getCurrentUser()
    ).subscribe({
      next: ([game, currentUser]) => {
        this.currentUserId = currentUser?.id;
        if (game) {
          this.game = game;
        } else {
          this.router.navigate(['/']);
        }

        this.usersSocket.on('game-started', (game: Game) => {
          alert('Game started!');
          this.game = game;
        });
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.activatedRoute.params.subscribe((params) => {
      this.gamesService.getGame(params['id'] as string).subscribe({
        next: (game) => {
          if (!game) {
            this.router.navigate(['/']);
            return;
          }
          this.game = game;
        },
        error: (err) => {
          console.error(err);
        },
      });
    });
  }
}

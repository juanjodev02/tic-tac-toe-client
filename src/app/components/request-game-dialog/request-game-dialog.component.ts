import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { Game } from 'src/app/core/models/Game';
import { User } from 'src/app/core/models/User';
import { GamesService } from 'src/app/core/services/games.service';

@Component({
  selector: 'app-request-game-dialog',
  templateUrl: './request-game-dialog.component.html',
  styleUrls: ['./request-game-dialog.component.scss'],
})
export class RequestGameDialogComponent implements OnInit {
  @Input()
  game?: Game;

  currentUserId?: string | null = null;

  @Input()
  incomingPlayer?: User;

  constructor(
    private gamesService: GamesService,
    private router: Router,
    private dialogRef: NbDialogRef<RequestGameDialogComponent>
  ) {}

  ngOnInit(): void {}

  accept() {
    this.gamesService
      .acceptGame(this.game!.id as string, this.currentUserId!)
      .subscribe({
        next: (game) => {
          this.dialogRef.close();
          this.router.navigate(['/game', game.id]);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  decline() {
    this.gamesService
      .rejectGame(this.game!.id as string, this.currentUserId!)
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}

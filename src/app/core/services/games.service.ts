import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Game } from '../models/Game';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  constructor(private httpClient: HttpClient) {}

  getGame(gameId: string) {
    return this.httpClient.get<Game>(
      `${environment.apiBaseUrl}/games/${gameId}`
    );
  }

  requestGame(requestPlayerId: string, requestedPlayerId: string) {
    return this.httpClient.post<Game>(
      `${environment.apiBaseUrl}/games/request-game`,
      {
        requestPlayerId,
        requestedPlayerId,
      }
    );
  }

  acceptGame(gameId: string, playerId: string) {
    return this.httpClient.post<Game>(
      `${environment.apiBaseUrl}/games/accept-game`,
      {
        gameId,
        playerId,
      }
    );
  }

  rejectGame(gameId: string, playerId: string) {
    return this.httpClient.post<Game>(
      `${environment.apiBaseUrl}/games/reject-game`,
      {
        gameId,
        playerId,
      }
    );
  }
}

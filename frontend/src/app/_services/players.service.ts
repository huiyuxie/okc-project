import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerSummary } from '../_models/player-summary.model';

import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getPlayerSummary(playerID: number): Observable<PlayerSummary> {
    const endpoint = `${this.baseUrl}/playerSummary/${playerID}`;

    return this.get(endpoint).pipe(
      map((data: any) => {
        return {
          name: data.name,
          games: data.games.map((game: any) => ({
            date: game.date,
            isStarter: game.isStarter,
            minutes: game.minutes,
            points: game.points,
            assists: game.assists,
            offensiveRebounds: game.offensiveRebounds,
            defensiveRebounds: game.defensiveRebounds,
            steals: game.steals,
            blocks: game.blocks,
            turnovers: game.turnovers,
            defensiveFouls: game.defensiveFouls,
            offensiveFouls: game.offensiveFouls,
            freeThrowsMade: game.freeThrowsMade,
            freeThrowsAttempted: game.freeThrowsAttempted,
            twoPointersMade: game.twoPointersMade,
            twoPointersAttempted: game.twoPointersAttempted,
            threePointersMade: game.threePointersMade,
            threePointersAttempted: game.threePointersAttempted,
            shots: game.shots.map((shot: any) => ({
              isMake: shot.isMake,
              locationX: shot.locationX,
              locationY: shot.locationY,
            })),
          })),
        } as PlayerSummary;
      }),
      (error) => {
        return error;
      }
    );
  }
}

import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { PlayerSummary } from '../_models/player-summary.model';

import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getPlayerSummary(playerID: number): Observable<PlayerSummary> {
    const endpoint = `${this.baseUrl}/playerSummary/${playerID}`;

    return this.get(endpoint).pipe((
      map((data: any) => {
        return {
          name: data.name,
          game: data.game
        } as PlayerSummary;
      }),
      error => {
          return error;
      }
    ));
  }
}
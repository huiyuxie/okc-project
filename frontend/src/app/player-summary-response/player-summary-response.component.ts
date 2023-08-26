import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {untilDestroyed, UntilDestroy} from '@ngneat/until-destroy';
import {PlayersService} from '../_services/players.service';
import { PlayerSummary } from '../_models/player-summary.model';

@UntilDestroy()
@Component({
  selector: 'player-summary-response-component',
  templateUrl: './player-summary-response.component.html',
  styleUrls: ['./player-summary-response.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerSummaryResponseComponent implements OnInit, OnDestroy {

  public playerSummary: PlayerSummary;

  endpoint: any;
  apiResponse: any;
  playerID: number = 1;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected playersService: PlayersService,
  ) {

  }

  ngOnInit(): void {
    this.fetchApiResponse();
  }

  changeParams(): void {
    this.fetchApiResponse();
  }

  fetchApiResponse(): void {
    this.playersService.getPlayerSummary(this.playerID).pipe(untilDestroyed(this)).subscribe(
      (data: PlayerSummary) => {
        console.log('Fetched API Data:', data);
        this.playerSummary = data; // updating the component's playerSummary with the fetched data
      },
      (error) => {
        console.error('Error fetching player summary:', error);
        // Handle the error appropriately here - maybe set playerSummary to some error state or display an error message
      }
    );
}

  ngOnDestroy() {
  }

}
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { PlayersService } from '../_services/players.service';
import { PlayerSummary } from '../_models/player-summary.model';

@UntilDestroy()
@Component({
  selector: 'player-summary-component',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerSummaryComponent implements OnInit, OnDestroy {
  public playerSummary: PlayerSummary;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected playersService: PlayersService
  ) {}

  ngOnInit(): void {
    this.playersService
      .getPlayerSummary(1)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: PlayerSummary) => {
          console.log('About to set playerSummary with:', data);
          this.playerSummary = data;
          console.log('playerSummary is now:', this.playerSummary);
        },
        (error) => {
          console.error('Error fetching player summary:', error);
        }
      );
  }

  ngOnDestroy() {}
}

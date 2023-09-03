import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { PlayersService } from '../_services/players.service';
import { PlayerSummary } from '../_models/player-summary.model';
import { switchMap } from 'rxjs';
import * as d3 from 'd3';

@UntilDestroy()
@Component({
  selector: 'player-summary-component',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerSummaryComponent implements OnInit, OnDestroy {
  public playerSummary: PlayerSummary | null = null;
  public selectedPlayerID: number | null = null;
  public barChartData: any[];

  public overallFreeThrowsMade: number = 0;
  public overallFreeThrowsAttempted: number = 0;

  public overallTwoPointersMade: number = 0;
  public overallTwoPointersAttempted: number = 0;

  public overallThreePointersMade: number = 0;
  public overallThreePointersAttempted: number = 0;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected playersService: PlayersService
  ) {}

  ngOnInit(): void {
    this.fetchPlayerData(this.selectedPlayerID);
  }

  getTeam(playerID: number): string {
    if (playerID <= 16) {
      return 'Monstars';
    } else if (playerID >= 17) {
      return 'Tune Squad';
    }
    return '';
  }

  drawShots() {
    const svg = d3.select('#shotChart');
    svg.selectAll('*').remove();

    const hoopX = 248;
    const hoopY = 416;
    const scaleX = 10;
    const scaleY = 10;

    if (this.playerSummary && this.playerSummary.games) {
      this.playerSummary.games.forEach((game) => {
        if (game.shots) {
          game.shots.forEach((shot) => {
            const shotX = hoopX + shot.locationX * scaleX;
            const shotY = hoopY - shot.locationY * scaleY;

            svg
              .append('circle')
              .attr('cx', shotX)
              .attr('cy', shotY)
              .attr('r', 5)
              .style('fill', shot.isMake ? 'green' : 'red');
          });
        }
      });
    }
  }

  fetchPlayerData(playerID: number): void {
    if (playerID !== null) {
      this.playersService
        .getPlayerSummary(playerID)
        .pipe(untilDestroyed(this))
        .subscribe(
          (data: PlayerSummary) => {
            this.playerSummary = data;
            this.playerSummary.team = this.getTeam(playerID);

            if (this.playerSummary) {
              this.barChartData = this.playerSummary.games.map((game) => ({
                name: game.date,
                value: game.points,
              }));

              this.cdr.detectChanges();
              this.drawShots();
            }
          },
          (error) => {
            console.error('Error fetching player summary:', error);
          }
        );
    }
  }

  onPlayerSelectionChange(): void {
    this.fetchPlayerData(this.selectedPlayerID);
  }

  ngOnDestroy() {}
}

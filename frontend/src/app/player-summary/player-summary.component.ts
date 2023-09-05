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

  public shotsPieChartData: any[] = [];
  public performancePieChartData: any[] = [];

  public totalFreeThrowsMade: number = 0;
  public totalFreeThrowsAttempted: number = 0;

  public totalTwoPointersMade: number = 0;
  public totalTwoPointersAttempted: number = 0;

  public totalThreePointersMade: number = 0;
  public totalThreePointersAttempted: number = 0;

  public totalShotsMade: number = 0;
  public totalShotsAttempted: number = 0;

  public totalAssists: number = 0;
  public totalOffensiveRebounds: number = 0;
  public totalDeffensiveRebounds: number = 0;
  public totalSteals: number = 0;
  public totalBlocks: number = 0;
  public totalTurnovers: number = 0;
  public totalOffensiveFouls: number = 0;
  public totalDeffensiveFouls: number = 0;

  public totalPerformance = 0;

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

    const tooltip = d3.select('#tooltip');

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
              .style('fill', shot.isMake ? 'green' : 'red')
              .on('mouseover', function (event, d) {
                d3.select('#tooltipContent').html(
                  `Location: (${shot.locationX}, ${
                    shot.locationY
                  })<br> Status: ${shot.isMake ? 'Made' : 'Missed'}
                  <br> Date: ${game.date}`
                );
                tooltip
                  .style('left', shotX + 30 + 'px')
                  .style('top', shotY + 80 + 'px')
                  .classed('hidden', false);
              })
              .on('mouseout', function (d) {
                tooltip.classed('hidden', true);
              });
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

            this.totalFreeThrowsMade = 0;
            this.totalFreeThrowsAttempted = 0;
            this.totalTwoPointersMade = 0;
            this.totalTwoPointersAttempted = 0;
            this.totalThreePointersMade = 0;
            this.totalThreePointersAttempted = 0;
            this.totalShotsMade = 0;
            this.totalShotsAttempted = 0;

            this.totalAssists = 0;
            this.totalOffensiveRebounds = 0;
            this.totalDeffensiveRebounds = 0;
            this.totalSteals = 0;
            this.totalBlocks = 0;
            this.totalTurnovers = 0;
            this.totalOffensiveFouls = 0;
            this.totalDeffensiveFouls = 0;

            this.totalPerformance = 0;

            if (this.playerSummary) {
              this.playerSummary.games.forEach((game) => {
                this.totalFreeThrowsMade += game.freeThrowsMade;
                this.totalFreeThrowsAttempted += game.freeThrowsAttempted;

                this.totalTwoPointersMade += game.twoPointersMade;
                this.totalTwoPointersAttempted += game.twoPointersAttempted;

                this.totalThreePointersMade += game.threePointersMade;
                this.totalThreePointersAttempted += game.threePointersAttempted;

                this.totalAssists += game.assists;
                this.totalOffensiveRebounds += game.offensiveRebounds;
                this.totalDeffensiveRebounds += game.defensiveRebounds;
                this.totalSteals += game.steals;
                this.totalBlocks += game.blocks;
                this.totalTurnovers += game.turnovers;
                this.totalOffensiveFouls += game.offensiveFouls;
                this.totalDeffensiveFouls += game.defensiveFouls;

                this.totalShotsMade +=
                  game.freeThrowsMade +
                  game.twoPointersMade +
                  game.threePointersMade;
                this.totalShotsAttempted +=
                  game.freeThrowsAttempted +
                  game.twoPointersAttempted +
                  game.threePointersAttempted;

                this.totalPerformance +=
                  game.assists +
                  game.offensiveRebounds +
                  game.defensiveRebounds +
                  game.steals +
                  game.blocks +
                  game.turnovers +
                  game.offensiveFouls +
                  game.defensiveFouls;
              });

              this.performancePieChartData = [
                {
                  name: `Assists (${(
                    (this.totalAssists / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalAssists,
                },
                {
                  name: `Offensive Rebounds (${(
                    (this.totalOffensiveRebounds / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalOffensiveRebounds,
                },
                {
                  name: `Defensive Rebounds (${(
                    (this.totalDeffensiveRebounds / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalDeffensiveRebounds,
                },
                {
                  name: `Steals (${(
                    (this.totalSteals / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalSteals,
                },
                {
                  name: `Blocks (${(
                    (this.totalBlocks / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalBlocks,
                },
                {
                  name: `Turnovers (${(
                    (this.totalTurnovers / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalTurnovers,
                },
                {
                  name: `Offensive Fouls (${(
                    (this.totalOffensiveFouls / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalOffensiveFouls,
                },
                {
                  name: `Deffensive Fouls (${(
                    (this.totalDeffensiveFouls / this.totalPerformance) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalDeffensiveFouls,
                },
              ];

              this.shotsPieChartData = [
                {
                  name: `Free Throws Made (${(
                    (this.totalFreeThrowsMade / this.totalShotsAttempted) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalFreeThrowsMade,
                },
                {
                  name: `Free Throws Attempted (${(
                    (this.totalFreeThrowsAttempted / this.totalShotsAttempted) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalFreeThrowsAttempted,
                },
                {
                  name: `Two Pointers Made (${(
                    (this.totalTwoPointersMade / this.totalShotsAttempted) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalTwoPointersMade,
                },
                {
                  name: `Two Pointers Attempted (${(
                    (this.totalTwoPointersAttempted /
                      this.totalShotsAttempted) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalTwoPointersAttempted,
                },
                {
                  name: `Three Pointers Made (${(
                    (this.totalThreePointersMade / this.totalShotsAttempted) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalThreePointersMade,
                },
                {
                  name: `Three Pointers Attempted (${(
                    (this.totalThreePointersAttempted /
                      this.totalShotsAttempted) *
                    100
                  ).toFixed(2)}%)`,
                  value: this.totalThreePointersAttempted,
                },
              ];

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

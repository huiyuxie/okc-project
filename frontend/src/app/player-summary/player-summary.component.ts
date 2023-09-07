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

  drawShotsChart() {
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

  drawShotsDistance() {
    const svg = d3.select('#shotDistancePlot');
    svg.selectAll('*').remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    svg.style('background-color', '#f9f9f9');

    const xScale = d3.scaleLinear().domain([-5, 55]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-5, 55]).range([height, 0]);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('background-color', 'white')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('pointer-events', 'none');

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(11)
      .tickSizeInner(-height)
      .tickSizeOuter(0)
      .tickPadding(10);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(11)
      .tickSizeInner(-width)
      .tickSizeOuter(0)
      .tickPadding(10);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .attr('font-size', '12px')
      .attr('color', '#777')
      .selectAll('.tick line')
      .attr('stroke', '#eee')
      .attr('stroke-width', 0.5);

    svg.selectAll('.tick text').style('opacity', 0);

    svg
      .append('g')
      .call(yAxis)
      .attr('font-size', '12px')
      .attr('color', '#777')
      .selectAll('.tick line')
      .attr('stroke', '#eee')
      .attr('stroke-width', 0.5);

    svg.selectAll('.tick text').style('opacity', 0);

    svg.selectAll('.domain').remove();

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 110},10)`);

    legend
      .append('rect')
      .attr('width', 100)
      .attr('height', 50)
      .attr('fill', 'white')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('rx', 5)
      .attr('ry', 5);

    const dataLegend = [
      { color: '#007ac1', label: 'Made' },
      { color: 'none', label: 'Missed' },
    ];

    legend
      .selectAll('circle')
      .data(dataLegend)
      .enter()
      .append('circle')
      .attr('cx', 15)
      .attr('cy', (d, i) => i * 25 + 12)
      .attr('r', 5)
      .style('fill', (d) => d.color)
      .attr('stroke', '#007ac1')
      .attr('stroke-width', (d) => (d.color === 'none' ? 2 : 0));

    legend
      .selectAll('text')
      .data(dataLegend)
      .enter()
      .append('text')
      .attr('x', 30)
      .attr('y', (d, i) => i * 25 + 17)
      .text((d) => d.label)
      .attr('font-size', '12px')
      .attr('fill', '#666');

    for (let i = 0; i <= 50; i += 5) {
      svg
        .append('text')
        .attr('x', xScale(i) - 5)
        .attr('y', yScale(0) + 20)
        .text(i)
        .attr('font-size', '10px')
        .attr('fill', '#666');

      svg
        .append('text')
        .attr('x', xScale(0) - 20)
        .attr('y', yScale(i) + 5)
        .text(i)
        .attr('font-size', '10px')
        .attr('fill', '#666');
    }

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#777')
      .text('Abs Location X');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#777')
      .text('Abs Location Y');

    if (this.playerSummary && this.playerSummary.games) {
      this.playerSummary.games.forEach((game) => {
        if (game.shots) {
          game.shots.forEach((shot) => {
            const shotX = xScale(Math.abs(shot.locationX));
            const shotY = yScale(Math.abs(shot.locationY));

            svg
              .append('circle')
              .attr('cx', shotX)
              .attr('cy', shotY)
              .attr('r', 5)
              .attr('stroke', '#007ac1')
              .attr('stroke-width', shot.isMake ? 0 : 2)
              .style('fill', shot.isMake ? '#007ac1' : 'none')
              .style('opacity', 0.7)
              .on('mouseover', function (event, d) {
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip
                  .html(
                    'Location X: ' +
                      Math.abs(shot.locationX) +
                      '<br/>Location Y: ' +
                      Math.abs(shot.locationY) +
                      '<br>Diatance: ' +
                      Math.sqrt(
                        shot.locationX ** 2 + shot.locationY ** 2
                      ).toFixed(2)
                  )
                  .style('left', event.pageX + 10 + 'px')
                  .style('top', event.pageY - 28 + 'px');

                d3.select(this).style('opacity', 1).attr('r', 7);
              })
              .on('mouseout', function () {
                tooltip.transition().duration(500).style('opacity', 0);

                d3.select(this).style('opacity', 0.7).attr('r', 5);
              });
          });
        }
      });
    }
  }

  drawShotsDistribution() {
    const svg = d3.select('#shotDistributionPlot');
    svg.selectAll('*').remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const padding = { top: 20, right: 20, bottom: 30, left: 35 };

    svg.style('background-color', '#f9f9f9');

    const distances = [];
    if (this.playerSummary && this.playerSummary.games) {
      this.playerSummary.games.forEach((game) => {
        if (game.shots) {
          game.shots.forEach((shot) => {
            const distance = Math.sqrt(
              shot.locationX ** 2 + shot.locationY ** 2
            );
            distances.push(distance);
          });
        }
      });
    }

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('background-color', 'white')
      .style('padding', '5px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '5px')
      .style('position', 'absolute')
      .style('pointer-events', 'none');

    const histogram = d3
      .histogram()
      .value((d) => d)
      .domain([0, 50])
      .thresholds(30);

    const bins = histogram(distances);

    const x = d3
      .scaleLinear()
      .domain([0, 50])
      .range([padding.left, width - padding.right]);

    const y = d3
      .scaleLinear()
      .domain([0, 30])
      .range([height - padding.bottom, padding.top]);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 30])
      .range(['#4cb8e6', '#007ac1']);

    const xAxis = d3.axisBottom(x).ticks(10).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format('d'));

    svg
      .append('g')
      .attr('transform', `translate(0,${height - padding.bottom})`)
      .call(xAxis)
      .attr('color', '#777');

    svg
      .append('g')
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis)
      .attr('color', '#777');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .attr('fill', '#777')
      .text('Shot Distance');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 10)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#777')
      .text('Number of Shots');

    svg
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.x0 as number))
      .attr('y', (d) => y(d.length))
      .attr('width', (d) => x(d.x1 as number) - x(d.x0 as number))
      .attr('height', (d) => height - padding.bottom - y(d.length))
      .attr('fill', (d) => colorScale(d.length))
      .attr('stroke', '#3399ff')
      .attr('stroke-width', 0.5)
      .on('mouseover', function (event, d) {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            'Shot Distance: ' +
              d.x0 +
              ' to ' +
              d.x1 +
              '<br/>' +
              'Number of Shots: ' +
              d.length
          )
          .style('left', event.pageX + 5 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function (d) {
        tooltip.transition().duration(500).style('opacity', 0);
      });
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
              this.drawShotsChart();
              this.drawShotsDistance();
              this.drawShotsDistribution();
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

# -*- coding: utf-8 -*-
"""Contains models related to stats"""
from django.db import models


class Team(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Player(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Game(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    home_team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='home_games')
    away_team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='away_games')

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} on {self.date}"


class GamePlayer(models.Model):
    id = models.AutoField(primary_key=True)
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name='game_players')
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name='player_games')
    is_starter = models.BooleanField()
    minutes = models.IntegerField()
    points = models.IntegerField()
    assists = models.IntegerField()
    offensive_rebounds = models.IntegerField()
    defensive_rebounds = models.IntegerField()
    steals = models.IntegerField()
    blocks = models.IntegerField()
    turnovers = models.IntegerField()
    defensive_fouls = models.IntegerField()
    offensive_fouls = models.IntegerField()
    free_throws_made = models.IntegerField()
    free_throws_attempted = models.IntegerField()
    two_pointers_made = models.IntegerField()
    two_pointers_attempted = models.IntegerField()
    three_pointers_made = models.IntegerField()
    three_pointers_attempted = models.IntegerField()

    def __str__(self):
        return f'{self.game} - {self.player}'


class Shot(models.Model):
    id = models.AutoField(primary_key=True)
    game_player = models.ForeignKey(GamePlayer, on_delete=models.CASCADE)
    is_make = models.BooleanField()
    location_x = models.DecimalField(max_digits=10, decimal_places=5)
    location_y = models.DecimalField(max_digits=10, decimal_places=5)

    def __str__(self):
        return f'{self.game_player} - Make: {self.is_make}'

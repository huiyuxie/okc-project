# -*- coding: utf-8 -*-
import logging
from functools import partial
import json
import os

from rest_framework.response import Response
from rest_framework.views import APIView, exception_handler
from app.dbmodels import models

LOGGER = logging.getLogger('django')


class PlayerSummary(APIView):
    logger = LOGGER

    def get(self, request, playerID):
        try:
            player = models.Player.objects.get(player_id=playerID)
            games = models.GamePlayer.objects.filter(player_id=playerID)

            response_data = {"name": player.player_name, "games": []}

            for game in games:
                game_data = {
                    "date": models.Game.objects.get(game_id=game.game_id.game_id).date,
                    "isStarter": game.is_starter,
                    "minutes": game.minutes,
                    "points": game.points,
                    "assists": game.assists,
                    "offensiveRebounds": game.offensive_rebounds,
                    "defensiveRebounds": game.defensive_rebounds,
                    "steals": game.steals,
                    "blocks": game.blocks,
                    "turnovers": game.turnovers,
                    "defensiveFouls": game.defensive_fouls,
                    "offensiveFouls": game.offensive_fouls,
                    "freeThrowsMade": game.free_throws_made,
                    "freeThrowsAttempted": game.free_throws_attempted,
                    "twoPointersMade": game.two_pointers_made,
                    "twoPointersAttempted": game.two_pointers_attempted,
                    "threePointersMade": game.three_pointers_made,
                    "threePointersAttempted": game.three_pointers_attempted
                }

                shots = models.Shot.objects.filter(
                    game_player_id=game.game_player_id)
                shots_data = [{"isMake": shot.is_make, "locationX": shot.location_x,
                               "locationY": shot.location_y} for shot in shots]
                game_data["shots"] = shots_data
                response_data["games"].append(game_data)

            return Response(response_data)

        except models.Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=404)

        except Exception as e:
            LOGGER.error(f"An error occurred: {str(e)}")
            return Response({"error": "An error occurred"}, status=500)

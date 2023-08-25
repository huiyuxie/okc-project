import json

# Convert `teams.json` to a new format for loading data to `app.team`
with open('./raw_data/teams.json', 'r') as f:
    original_data = json.load(f)

converted_data = []

for team in original_data:
    converted_item = {
        "model": "app.Team",
        "pk": team["id"],
        "fields": {
            "team_name": team["name"]
        }
    }
    converted_data.append(converted_item)

with open('./raw_data/table_teams.json', 'w') as f:
    json.dump(converted_data, f, indent=2)

# Convert `players.json` to a new format for loading data to `app.player`
with open('./raw_data/games.json', 'r') as f:
    original_data = json.load(f)

player_to_team_mapping = {}

for game in original_data:
    for team_key in ['homeTeam', 'awayTeam']:
        for player in game[team_key]['players']:
            player_to_team_mapping[player['id']] = game[team_key]['id']

with open('./raw_data/players.json', 'r') as f:
    original_data = json.load(f)

converted_data = []

for player in original_data:
    team_id = player_to_team_mapping.get(player['id'])
    converted_item = {
        "model": "app.Player",
        "pk": player["id"],
        "fields": {
            "player_name": player["name"],
            "team_id": team_id
        }
    }
    converted_data.append(converted_item)

with open('./raw_data/table_players.json', 'w') as f:
    json.dump(converted_data, f, indent=2)

# Convert `games.json` to a new format for loading data to `app.game`
with open('./raw_data/games.json', 'r') as f:
    original_data = json.load(f)

converted_data = []

for game in original_data:
    converted_item = {
        "model": "app.Game",
        "pk": game["id"],
        "fields": {
            "date": game["date"],
            "home_team_id": game["homeTeam"]["id"],
            "away_team_id": game["awayTeam"]["id"]
        }
    }
    converted_data.append(converted_item)

with open('./raw_data/table_games.json', 'w') as f:
    json.dump(converted_data, f, indent=2)

# Convert `games.json` to a new format for loading data to `app.gameplayer`
with open('./raw_data/games.json', 'r') as f:
    original_data = json.load(f)

converted_data = []
pk_counter = 1

for game in original_data:
    home_players = game["homeTeam"]["players"]
    away_players = game["awayTeam"]["players"]
    players = home_players + away_players

    for player in players:
        converted_item = {
            "model": "app.GamePlayer",
            "pk": pk_counter,
            "fields": {
                "game_id": game["id"],
                "player_id": player["id"],
                "is_starter": player["isStarter"],
                "minutes": player["minutes"],
                "points": player["points"],
                "assists": player["assists"],
                "offensive_rebounds": player["offensiveRebounds"],
                "defensive_rebounds": player["defensiveRebounds"],
                "steals": player["steals"],
                "blocks": player["blocks"],
                "turnovers": player["turnovers"],
                "defensive_fouls": player["defensiveFouls"],
                "offensive_fouls": player["offensiveFouls"],
                "free_throws_made": player["freeThrowsMade"],
                "free_throws_attempted": player["freeThrowsAttempted"],
                "two_pointers_made": player["twoPointersMade"],
                "two_pointers_attempted": player["twoPointersAttempted"],
                "three_pointers_made": player["threePointersMade"],
                "three_pointers_attempted": player["threePointersAttempted"]
            }
        }
        converted_data.append(converted_item)
        pk_counter += 1

with open('./raw_data/table_gameplayers.json', 'w') as f:
    json.dump(converted_data, f, indent=2)

# Convert `games.json` to a new format for loading data to `app.shot`
with open('./raw_data/games.json', 'r') as f:
    original_data = json.load(f)

converted_data = []
pk_counter = 1
fk_counter = 1

for game in original_data:
    home_players = game["homeTeam"]["players"]
    away_players = game["awayTeam"]["players"]
    players = home_players + away_players

    for player in players:
        shots = player["shots"]

        for shot in shots:
            converted_item = {
                "model": "app.Shot",
                "pk": pk_counter,
                "fields": {
                    "game_player_id": fk_counter,
                    "is_make": shot["isMake"],
                    "location_x": shot["locationX"],
                    "location_y": shot["locationY"]
                }
            }
            converted_data.append(converted_item)
            pk_counter += 1

        fk_counter += 1

with open('./raw_data/table_shots.json', 'w') as f:
    json.dump(converted_data, f, indent=2)

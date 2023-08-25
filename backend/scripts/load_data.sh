#!/bin/bash

# Run command `cd /path/to/project/backend` if that is not your current directory

# Run command `./scripts/load_data.sh` to run the whole shell script
export DATABASE_URL=postgresql://okcapplicant:thunder@localhost:5432/okc

python manage.py makemigrations
python manage.py migrate 

python ./scripts/convert_data.py

python manage.py loaddata raw_data/table_teams.json
python manage.py loaddata raw_data/table_players.json
python manage.py loaddata raw_data/table_games.json
python manage.py loaddata raw_data/table_gameplayers.json
python manage.py loaddata raw_data/table_shots.json
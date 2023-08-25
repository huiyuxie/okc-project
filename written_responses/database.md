# OKC Database Description

The `okc` database is a structured relational database designed to efficiently manage and store data related to sports statistics, specifically tailored for basketball games. It operates under the schema titled `app`.

## Main Components

There are five primary tables in the `app` schema, specifically `Team`, `Player`, `Game`, `GamePlayer`, and `Shot`, each containing unique attributes and relationships that define the structure of the database.

- **Team Table**: Includes team ID (Primary Key) and name, with one-to-many relationships to the `Player` and `Game` tables. It represents multiple players and games per team.

- **Player Table**: Contains player details such as player ID (Primary Key), name, and a foreign key linked to the `Team` table. It establishes a many-to-one relationship with the `Team` table, linking each player to their respective team.

- **Game Table**: Stores information about individual games, including the game ID (Primary Key), date, and foreign key references to home and away teams in the `Team` table. It establishes a many-to-one relationship with the `Team` table for both home and away teams, reflecting the match-ups and the participating teams in each game.

- **GamePlayer Table**: Represents the specific data for a player in a particular game. It contains an auto-incrementing ID (Primary Key), and it's uniquely identified by a combination of game ID (from `Game` table) and player ID (from `Player` table) as foreign keys. This table includes details such as points, rebounds, assists, and other game-specific statistics, providing an individualized snapshot of a player's performance in a game.

- **Shot Table**: Tracks individual shots taken by players during a game. It contains a shot ID (Primary Key) and a foreign key reference to the `GamePlayer` table, linking each shot to a specific player's game record. Key attributes include whether the shot was made (`is_make`) and its location on the court (`location_x` and `location_y`). This table serves as a detailed log of all shots attempted, enriching the statistical analysis of player performance.

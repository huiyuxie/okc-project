# Project Report

This document provides a concise guide to facilitate the setup and understanding of the OKC project.

### Backend

The backend setup closely follows the guidelines provided in the `README.md` file.

The script to initialize the database and load the corresponding data is located at `/backend/scripts/load_data.sh`.

To execute the script, navigate to the project backend directory using:

```Bash
cd /path/to/project/backend
```

Ensure that you are in the correct directory, then run the following command to execute the script:

```Bash
./scripts/load_data.sh
```

This will set up the database with the required data.

To launch the backend, execute the following command:

```Bash
python manage.py runserver
```

By following the above steps, the backend will be successfully prepared and running.

Also, there is a `database.md` file under the `/written_responses` directory to help better understand the database structure.

### Frontend

While there were challenges in setting up the frontend following the `README.md` instructions, the frontend was set up from scratch. The majority of the modules and packages utilized for the frontend are of the latest versions.

The primary frontend implementation resides in the `/frontend/src/app/player-summary` directory.

To launch the frontend, navigate to the project's frontend directory with the following command:

```Bash
cd /path/to/project/frontend
```

To launch the frontend, execute the following command:

```Bash
npm start
```

By following the above steps, the okc webpage can be accessed at http://localhost:4200/player-summary.

The frontend primarily encompasses five sections:

1. **Player ID Selection:** Use the dropdown menu to select a player ID and view data specific to that player.
2. **Player Information:** Displays the selected player's name and team affiliation.
3. **Game Data:** Showcases detailed performance data for the chosen player across all games, organized by date.
4. **Game Plot:** Visualizes shot locations on the given basketball court diagram.
5. **Player Summary:** Offers a comprehensive capability overview for the player, covering areas such as Performance Breakdown, Shot Accuracy, Shot Breakdown, Shot Distance Plot, Shot Distribution Plot, and Player Efficiency Rating (PER).

The screenshots of these five parts are attached below, please feel free to check each of them.

The fundamental design principle for the frontend is to ensure conciseness and clarity. Primarily, the color palette is influenced by the OKC color `#007ac1`.

### Appendix

![Screenshot 1](/screenshots/Screenshot1.png)

![Screenshot 2](/screenshots/Screenshot2.png)

![Screenshot 3](/screenshots/Screenshot3.png)

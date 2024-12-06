const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for teams
let teams = [
    { name: 'Manchester United', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
    { name: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
    { name: 'Chelsea', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
    { name: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
];

// GET route: Retrieve all teams
app.get('/teams', (req, res) => {
    res.json(teams);
});

// POST route: Add a new team
app.post('/teams', (req, res) => {
    const { name, logo } = req.body;
    if (name && logo) {
        const newTeam = { name, logo };
        teams.push(newTeam);
        res.status(201).json(newTeam);
    } else {
        res.status(400).json({ error: 'Name and logo are required.' });
    }
});

// PUT route: Edit a team's name
app.put('/teams/:name', (req, res) => {
    const teamName = req.params.name;
    const updatedName = req.body.name;

    let teamFound = false;
    teams = teams.map((team) => {
        if (team.name === teamName) {
            teamFound = true;
            return { ...team, name: updatedName };
        }
        return team;
    });

    if (teamFound) {
        res.status(200).json({ message: `${teamName} has been updated to ${updatedName}.` });
    } else {
        res.status(404).json({ error: `${teamName} not found.` });
    }
});

// DELETE route: Delete a team by name
app.delete('/teams/:name', (req, res) => {
    const teamName = req.params.name;
    const initialLength = teams.length;
    teams = teams.filter(team => team.name !== teamName);

    if (teams.length < initialLength) {
        res.status(200).json({ message: `${teamName} has been deleted.` });
    } else {
        res.status(404).json({ error: `${teamName} not found.` });
    }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

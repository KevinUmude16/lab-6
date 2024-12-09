const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.m7xdb.mongodb.net/myfootballteamapp', // Replace with your database name
    { dbName: 'myfootballteamapp' }
)
.then(() => {
    console.log('MongoDB connected successfully');
    seedTeams(); // Call the function to seed teams on server start
})
.catch(err => console.error('Error connecting to MongoDB:', err));

// Mongoose Schema and Model
const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
});

const Team = mongoose.model('Team', teamSchema);

// Prepopulate Database with Default Teams
const seedTeams = async () => {
    const defaultTeams = [
        {
            name: 'Manchester United',
            logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        },
        {
            name: 'Manchester City',
            logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        },
        {
            name: 'Arsenal',
            logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        },
        {
            name: 'Liverpool',
            logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        },
        {
            name: 'Chelsea',
            logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        },
    ];

    try {
        const existingTeams = await Team.find();
        if (existingTeams.length === 0) {
            await Team.insertMany(defaultTeams);
            console.log('Default teams added to the database');
        } else {
            console.log('Teams already exist in the database, skipping seed');
        }
    } catch (err) {
        console.error('Error seeding teams:', err);
    }
};

// Routes

// GET route: Retrieve all teams
app.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching teams' });
    }
});

// POST route: Add a new team
app.post('/teams', async (req, res) => {
    const { name, logo } = req.body;
    if (!name || !logo) {
        return res.status(400).json({ error: 'Name and logo are required.' });
    }
    try {
        const newTeam = new Team({ name, logo });
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (err) {
        res.status(500).json({ error: 'Error adding team' });
    }
});

// PUT route: Edit a team's name
app.put('/teams/:name', async (req, res) => {
    const { name } = req.params; // Current team name
    const { name: newName } = req.body; // New team name
    try {
        const updatedTeam = await Team.findOneAndUpdate(
            { name }, // Find team by current name
            { name: newName }, // Update team name
            { new: true }
        );
        if (updatedTeam) {
            res.status(200).json({ message: `Team name updated to ${newName}`, team: updatedTeam });
        } else {
            res.status(404).json({ error: 'Team not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error updating team' });
    }
});

// DELETE route: Delete a team by name
app.delete('/teams/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const deletedTeam = await Team.findOneAndDelete({ name });
        if (deletedTeam) {
            res.status(200).json({ message: `Team ${name} has been deleted.` });
        } else {
            res.status(404).json({ error: 'Team not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error deleting team' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

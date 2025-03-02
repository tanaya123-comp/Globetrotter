const express = require('express');
const app = express();
const db = require('./database/db');  // Import db connection
const cors = require('cors');

app.use(cors());  // Allow cross-origin requests (for React frontend)
app.use(express.json());  // Parse JSON request bodie

//Fetch a random clue from the database for a destination
// GET /api/random-clue
app.get('/api/random-clue', async (req, res) => {
    try {
        // Step 1: Fetch a random destination and its clue
        const randomDestination = await db.query('SELECT * FROM destinations ORDER BY RANDOM() LIMIT 1');
        const destination = randomDestination.rows[0];

        // Fetch the clues for the random destination
        const cluesResult = await db.query('SELECT * FROM clues WHERE destination_id = $1 ORDER BY RANDOM() LIMIT 1', [destination.id]);
        const clue = cluesResult.rows[0].clue;

        // Step 2: Fetch 3 other random destinations to use as incorrect options
        const randomDestinationsForOptions = await db.query('SELECT * FROM destinations WHERE id != $1 ORDER BY RANDOM() LIMIT 3', [destination.id]);

        // Step 3: Prepare the options array (one correct answer + 3 incorrect options)
        const options = randomDestinationsForOptions.rows.map(dest => dest.city);
        options.push(destination.city);  // Add the correct answer

        const funFactsResult = await db.query('SELECT fun_fact FROM fun_facts WHERE destination_id = $1', [destination.id]);
        const funFact = funFactsResult.rows[0];

        // Shuffle the options to randomize their order
        options.sort(() => Math.random() - 0.5);

        // Step 4: Return the clue, the options, and the correct answer
        res.json({
            clue,
            options,
            correctAnswer: destination.city,
            funFact
        });

    } catch (err) {
        console.error('Error fetching random clue:', err);
        res.status(500).send('Server Error');
    }
});

// Check if the answer selected by user is correct or not
// POST /api/check-answer
app.post('/api/check-answer', async (req, res) => {
    const { userAnswer, destinationId } = req.body;

    try {
        // Fetch the destination's correct answer and details
        const destinationResult = await db.query('SELECT * FROM destinations WHERE id = $1', [destinationId]);
        const correctAnswer = destinationResult.rows[0].city;

        // Fetch the fun facts for the selected destination
        const funFactsResult = await db.query('SELECT fun_fact FROM fun_facts WHERE destination_id = $1', [destination.id]);
        const funFact = funFactsResult.rows[0];

        let feedback;
        if (userAnswer === correctAnswer) {
            feedback = { message: "🎉 Correct Answer!", funFact: funFact };
        } else {
            feedback = { message: "😢 Incorrect Answer!", funFact: funFact };
        }

        res.json(feedback);  // Send the response back to frontend with feedback
    } catch (err) {
        console.error('Error checking answer:', err);
        res.status(500).send('Server Error');
    }
});


// Fetch highest score from database
// GET /api/user-score/:username
app.get('/api/user-score/:username', async (req, res) => {
    const { username } = req.params;
    // Check if username is provided
    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const result = await db.query('SELECT * FROM user_scores WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json({ score: result.rows[0].highest_score });
    } catch (err) {
        console.error('Error fetching user score:', err);
        res.status(500).send('Server Error');
    }
});

// Add a new game after completing 10 rounds
// POST /api/game
app.post('/api/game', async (req, res) => {
    const { username, totalScore } = req.body;

    try {
        // Fetch the current highest score of the user
        const userResult = await db.query('SELECT * FROM user_scores WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const currentHighestScore = userResult.rows[0].highest_score;
        const userId = userResult.rows[0].id;

        // Update the user's highest score if the current game score is greater than their highest score
        if (totalScore > currentHighestScore) {
            await db.query('UPDATE user_scores SET highest_score = $1 WHERE username = $2', [totalScore, username]);
        }

        // Insert the completed game session into the games table
        await db.query('INSERT INTO games (user_id, score) VALUES ($1, $2)', [userId, totalScore]);

        res.status(201).send('Game session added and score updated if necessary');
    } catch (err) {
        console.error('Error adding game session:', err);
        res.status(500).send('Server Error');
    }
});

// Creating a new user
// POST /api/user
app.post('/api/user', async (req, res) => {
    const { username } = req.body;
    try {
        const result = await db.query('SELECT * FROM user_scores WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            return res.status(201).send('Welcome back '+username);
        }
        // Create a new user with a default score of 0
        await db.query('INSERT INTO user_scores (username, highest_score) VALUES ($1, 0)', [username]);
        res.status(201).send('Welcome '+username);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Server Error');
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


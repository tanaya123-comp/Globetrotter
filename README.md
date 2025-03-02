# Globetrotter Backend – A Travel Guessing Game

## Overview
The Globetrotter app is an interactive travel guessing game where users guess famous destinations based on cryptic clues. The backend handles user management, dynamic clue generation, scoring, and the Challenge a Friend feature.

## Features
- **Dataset Management**: Manages destinations, clues, fun facts, and trivia.
- **User Profiles**: Each user has a unique username and highest score tracking.
- **Game Logic**: 
    - Users are presented with a clue and multiple possible answers.
    - Users get immediate feedback (correct/incorrect) along with fun facts about the destination.
    - Users can track their score and move to the next destination.
    - Users can also see their highest score.
- **Challenge a Friend**: Generates an invite link that includes the player's score.

## Tech Stack
- **Backend**: Node.js with Express.js
- **Database**: Postgres
- **AI Integration**: OpenAI API (for expanding dataset)
- **API Requests**: Axios for API calls (such as fetching clues and facts)

## Architecture

1. **User Management**:
   - Users can register with a unique username.
   - Backend stores data about users username and highest score till now.
   
2. **Game Flow**:
   - When the user starts a new game, a random destination is selected.
   - A clue is generated from the dataset and shown to the user along with multiple choice answers.
   - The user selects an answer, and based on correctness, the game gives feedback (correct/incorrect) and shows a fun fact.
   - The game record is stored in the backend


4. **Challenge a Friend**:
   - A user can challenge a friend by generating a unique invite link.
   - The invited user can see the sender’s score before starting the game.

# API Endpoints

## 1. **POST /api/user**
- **Description**: Creates a new user or checks if the user already exists.


## 2. **GET /api/random-clue**
- **Description**: Fetches a random clue for a destination along with multiple choice options

## 3. **POST /api/check-answer**
- **Description**: Checks the user's selected answer for correctness.
  
## 4. **GET /api/user-score/:username**
- **Description**: Fetches the highest score of a user by their username

## 5. **POST /api/game **
- **Description**: Adds a completed game session and updates the user's highest score if necessary.

## 6. **POST /api/user-score**
- **Description**: Updates the highest score for a user after completing a game.

  



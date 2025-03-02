import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

const GamePage = () => {
    const [username, setUsername] = useState('');
    const [highestScore, setHighestScore] = useState(null);
    const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
    const [clue, setClue] = useState('');
    const [options, setOptions] = useState([]);  // State to store the answer options
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [currentScore, setCurrentScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(1); // Start from question 1
    const [gameOver, setGameOver] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(''); // State to store the correct answer
    const [selectedAnswer, setSelectedAnswer] = useState('');  // Track selected answer
    const [funFact, setFunFact] = useState('');

    // **Green: Handle username input**
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);  // Update username state
    };

    const fetchHighestScore = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user-score/${username}`);
            // Log the score to check the response
            console.log("Highest score response:", response.data.score);
            setHighestScore(response.data.score); // Set the highest score in the state
        } catch (error) {
            // Log error message in case of failure
            console.error("Error fetching user score:", error);
            // Optionally display an alert to the user
            alert("Error fetching user score. Please try again later.");
        }
    };

    // **Green: Handle username form submission**
    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        if (!username) {
            alert("Please enter a username!");  // Show alert if username is empty
            return;
        }

        try {
            // Register the user (send POST request to backend)
            await axios.post('http://localhost:5000/api/user', { username });

            // Fetch user details (e.g., score) from the backend
            const response = await axios.get(`http://localhost:5000/api/user-score/${username}`);
            console.log(response);

            setIsUsernameSubmitted(true);  // **Green: Mark that the username is submitted**
            fetchRandomClue();  // Start the game by fetching the first clue
        } catch (error) {
            console.error("Error registering user:", error);
            alert('Username already exists or there was an issue registering the user.');
        }
    };

    // Send the game result to the backend (NEW FUNCTION ADDED)
    const sendGameResult = useCallback(async () => {
        // NEW FUNCTION
            try {
                await axios.post('http://localhost:5000/api/game', {
                    username,
                    totalScore: currentScore, // Send the current score as the total score
                });

                console.log("Game result successfully saved!");
            } catch (error) {
                console.error("Error sending game result:", error);
                alert('Failed to save game result. Please try again later.');
            }
    },[username, currentScore]);

    // Fetch a random clue and options
    const fetchRandomClue = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/random-clue');  // Fetch the clue from the backend API
            setClue(response.data.clue);  // Set the clue text
            setOptions(response.data.options);  // Set the options array
            setCorrectAnswer(response.data.correctAnswer);  // Set the correct answer
            setFunFact(response.data.funFact.fun_fact); // Set the fun fact
        } catch (error) {
            console.error("Error fetching random clue:", error);
            setFeedbackMessage('Failed to load clue. Please try again later.');
        }
    };

    // Handle when the "Next" button is clicked
    const nextQuestion = () => {
        // Check if an answer has been selected before proceeding
        if (!selectedAnswer) {
            alert("Please select an option before proceeding!");
            return;
        }

        if (questionCount < 10) {
            setQuestionCount(prevCount => prevCount + 1); // Increment the question count
            fetchRandomClue();  // Fetch a new clue for the next question
            setFeedbackMessage('');  // Reset feedback message for the next question
            setSelectedAnswer('');  // Reset selected answer
        }
    };

    // Restart the game from scratch
    const restartGame = () => {
        setGameOver(false);  // Reset game over state
        setCurrentScore(0);  // Reset the score
        setQuestionCount(1); // Reset the question count to 1
        setSelectedAnswer(''); // Reset selected answer
        setFeedbackMessage(''); // Reset feedback message
        fetchRandomClue();  // Fetch the first clue of the new game
    };

    // Handle answer selection (correct/incorrect answer)
    const handleAnswer = (selected) => {
        setSelectedAnswer(selected);  // Set the selected answer
        if (selected === correctAnswer) {
            setFeedbackMessage("🎉 Correct Answer!");
            setCurrentScore(currentScore + 4);  // Increase score for correct answer
        } else {
            setFeedbackMessage("😢 Incorrect Answer!");
            setCurrentScore(currentScore - 1);  // Decrease score for incorrect answer
        }
    };

    // useEffect to load the first clue and handle game over logic
    useEffect(() => {
        if (isUsernameSubmitted) {
            fetchRandomClue(); // Fetch the first clue when the component mounts
        }
    }, [isUsernameSubmitted]);

    // Check if the game is over after each question
    useEffect(() => {
        if (questionCount >= 10) {
            setGameOver(true);
            setFeedbackMessage("Game Completed! Your score is final.");
            sendGameResult();
        }
    }, [questionCount, sendGameResult]); // Only run this effect when questionCount changes

    return (
        <div className="game-page">
            {/* **Green: Show username form if not submitted** */}
            {!isUsernameSubmitted ? (
                <div className="username-form">
                    <h2>Enter your Username</h2>
                    <form onSubmit={handleUsernameSubmit}>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            ) : (
                <>
                    <h2>Destination Clue Game</h2>

                    {/* Display current question number and current score */}
                    <div className="scoreboard">
                        <p>Player Name: {username}</p>
                        <p>Question: {questionCount} / 10</p>
                        <p>Score: {currentScore}</p>
                        {highestScore && <p>Highest Score: {highestScore}</p>}
                    </div>

                    {!gameOver && (
                        <>
                            <p> <b>CLUE:</b> {clue}</p> {/* Display the clue */}

                            <div className="options">
                                {/* Render the answer options as buttons */}
                                {options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(option)}
                                        className={selectedAnswer === option ? 'selected' : ''} // Highlight the selected option
                                        disabled={selectedAnswer} // Disable all options after an answer is selected
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <p>{feedbackMessage}</p>
                            { feedbackMessage && (
                                <>
                                    <p><b>Did you know?</b></p>
                                    <p>{funFact}</p>
                                </>
                            )}{/* Display feedback message */}
                        </>
                    )}

                    {!gameOver ? (
                        <div className="controls">
                            <button onClick={nextQuestion} disabled={questionCount >= 10}>
                                Next
                            </button>
                            <button onClick={
                                () => {
                                    const inviteLink = `https://wa.me/?text=Hey! 
                                    Join me in this amazing game My current Highest Score is ${highestScore}! Play it now: ${window.location.href}`;
                                    window.open(inviteLink, '_blank');
                                }
                            }>
                                Invite a Friend
                            </button>
                            <button onClick={fetchHighestScore}>
                                Highest Score
                            </button>
                        </div>
                    ) : (
                        <div className="game-over">
                            <h2>Game Completed</h2>
                            <h3>Your Final Score: {currentScore}</h3>
                            <button onClick={restartGame}>Play Again</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GamePage;
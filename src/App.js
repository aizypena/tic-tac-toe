import React, { useState, useEffect } from "react"; // Import necessary modules from React
import "./App.css"; // Import the styling of the app

function App() {
    // State variables for the game state and the next player
    const [gameState, setGameState] = useState(Array(9).fill(null)); // State for the game board
    const [xIsNext, setXIsNext] = useState(true); // State for tracking the current player's turn
    const winner = calculateWinner(gameState); // Determine if there's a winner

    useEffect(() => {
        // Reset the game board when the component mounts
        resetGame();
    }, []);

    // Function to handle a move when a square is clicked
    const handleMove = async (index) => {
        if (!gameState[index] && !winner) {
            // Check if the square is available and there's no winner yet
            const response = await fetch("http://localhost:3001/move", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index, isX: xIsNext }), // Send the index and current player's turn
            });
            const data = await response.json();
            if (data.success) {
                setGameState(data.gameState); // Update the game state with the new move
                setXIsNext(!xIsNext); // Toggle the player's turn
            }
        }
    };

    // Function to reset the game
    const resetGame = async () => {
        const response = await fetch("http://localhost:3001/reset");
        const data = await response.json();
        setGameState(data.gameState); // Reset the game state to the initial state
        setXIsNext(true); // Set the player's turn back to X
    };

    // Function to render each square
    const renderSquare = (index) => (
        <button
            className="square"
            onClick={() => handleMove(index)}
            disabled={gameState[index] || winner} // Disable the square if it's occupied or there's a winner
        >
            {gameState[index]}
        </button>
    );

    // Determine the game status
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else if (gameState.every((square) => square !== null)) {
        status = "Draw!";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    // Render the game board and UI
    return (
        <div className="game">
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
            <button className="reset-button" onClick={resetGame}>
                Reset Game
            </button>
        </div>
    );
}

// Function to calculate the winner based on the current game state
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null; // Return null if no winner
}

export default App; // Export the App component

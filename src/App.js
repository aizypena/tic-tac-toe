import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    // State variables for game state and player turn
    const [gameState, setGameState] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    // Initialize the game state when the component mounts
    useEffect(() => {
        resetGame();
    }, []);

    // Handle player move on a square
    const handleMove = async (index) => {
        if (!gameState[index]) {
            // Send a request to the server to make a move
            const response = await fetch("http://localhost:3001/move", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index, isX: xIsNext }),
            });
            const data = await response.json();
            if (data.success) {
                // Update the game state and player turn
                setGameState(data.gameState);
                setXIsNext(!xIsNext);
            }
        }
    };

    // Reset the game state
    const resetGame = async () => {
        // Send a request to the server to reset the game
        const response = await fetch("http://localhost:3001/reset");
        const data = await response.json();
        // Update the game state and set the first player as "X"
        setGameState(data.gameState);
        setXIsNext(true);
    };

    // Render a square button
    const renderSquare = (index) => (
        <button className="square" onClick={() => handleMove(index)}>
            {gameState[index]}
        </button>
    );

    // Calculate the winner based on the game state
    const winner = calculateWinner(gameState);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else if (gameState.every((square) => square !== null)) {
        status = "Draw!";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <div className="game">
            {/* Display the current game status */}
            <div className="status">{status}</div>
            {/* Render the game board */}
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
            {/* Reset Game button */}
            <button className="reset-button" onClick={resetGame}>
                Reset Game
            </button>
        </div>
    );
}

// Function to calculate the winner based on the squares
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
    return null;
}

export default App;

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let gameState = Array(9).fill(null); // Initial game state

app.post("/move", (req, res) => {
    const { index } = req.body;
    if (index >= 0 && index < gameState.length && gameState[index] === null) {
        gameState[index] = req.body.isX ? "X" : "O";
        res.json({ success: true, gameState });
    } else {
        res.status(400).json({ success: false, message: "Invalid move" });
    }
});

app.get("/reset", (req, res) => {
    gameState = Array(9).fill(null);
    res.json({ success: true, gameState });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

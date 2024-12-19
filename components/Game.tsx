import React, { useState, useEffect, FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

const Square: FC<SquareProps> = ({ value, onSquareClick }) => {
  return (
    <TouchableOpacity style={styles.square} onPress={onSquareClick}>
      <Text style={styles.squareText}>{value}</Text>
    </TouchableOpacity>
  );
};

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
  onReset: () => void;
  username: string;
}

const Board: FC<BoardProps> = ({
  xIsNext,
  squares,
  onPlay,
  onReset,
  username,
}) => {
  const handleClick = (i: number) => {
    if (calculateWinner(squares, username, xIsNext) || squares[i]) {
      return;
    }
    const nextSquares = [...squares];
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  };

  const winner = calculateWinner(squares, username, xIsNext);
  let status;
  if (winner) {
    status = winner === username ? `${username} won!` : "Enemy won!";
  } else {
    status = xIsNext ? `${username}'s turn` : "Enemy's turn";
  }

  return (
    <View style={styles.board}>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{status}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.boardContainer}>
        <View style={styles.boardRow}>
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </View>
        <View style={styles.boardRow}>
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </View>
        <View style={styles.boardRow}>
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </View>
      </View>
    </View>
  );
};

const Game: FC = () => {
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [username, setUsername] = useState("Player");

  useEffect(() => {
    // Load the saved username from AsyncStorage when the component mounts
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername !== null) {
        setUsername(savedUsername);
      }
    } catch (error) {
      console.error("Error loading username:", error);
    }
  };

  const handlePlay = (nextSquares: (string | null)[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const handleReset = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  return (
    <View style={styles.container}>
      <Board
        xIsNext={xIsNext}
        squares={currentSquares}
        onPlay={handlePlay}
        onReset={handleReset}
        username={username}
      />
    </View>
  );
};

function calculateWinner(
  squares: (string | null)[],
  username: string,
  xIsNext: boolean,
) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if (squares[a] === "X") {
        return username;
      } else {
        return "Enemy";
      }
    }
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boardContainer: {
    marginTop: 20,
  },
  boardRow: {
    flexDirection: "row",
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  squareText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Game;

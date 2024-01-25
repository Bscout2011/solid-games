import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";

export type BoardSize = 3 | 4;
interface BoardProps {
  boardSize: BoardSize;
}
export type Player = "X" | "O";
export type BoardType = (Player | null)[];

const initBoard = (boardSize: BoardSize): BoardType =>
  Array.from({ length: boardSize ** 2 }, () => null);

export const checkWin = (board: BoardType): boolean => {
  const boardSize = Math.sqrt(board.length);
  // winning can be horizontal, vertical, or diagonal
  for (let i = 0; i < boardSize; i++) {
    const occupant = board[i * boardSize];
    if (occupant === null) continue;
    let horizontalWin = true;
    for (let j = 1; j < boardSize; j++) {
      if (board[i * boardSize + j] !== occupant) {
        horizontalWin = false;
        break;
      }
    }
    if (horizontalWin) {
      console.log("Horizontal win " + i);
      return true;
    }
  }
  for (let j = 0; j < boardSize; j++) {
    const occupant = board[j];
    if (occupant === null) continue;
    let verticalWin = true;
    for (let i = 1; i < boardSize; i++) {
      if (board[i * boardSize + j] !== occupant) {
        verticalWin = false;
        break;
      }
    }
    if (verticalWin) {
      console.log("Vertical win " + j);
      return true;
    }
  }

  const leftOccupant = board[0];
  let leftDiagonalWin = true;
  for (let ii = 1; ii < boardSize; ii++) {
    if (leftOccupant === null) {
      leftDiagonalWin = false;
      break;
    } else if (board[ii * boardSize + ii] !== leftOccupant) {
      leftDiagonalWin = false;
      break;
    }
  }
  if (leftDiagonalWin) {
    console.log("Left diagonal win");
    return true;
  }

  const rightOccupant = board[boardSize - 1];
  let rightDiagonalWin = true;
  for (let i = 1, j = boardSize - 2; i < boardSize && j >= 0; i++, j--) {
    if (rightOccupant === null) {
      rightDiagonalWin = false;
      break;
    } else if (board[i * boardSize + j] !== rightOccupant) {
      rightDiagonalWin = false;
      break;
    }
  }
  if (rightDiagonalWin) {
    console.log("Right diagonal win");
    return true;
  }

  return false;
};

const boardFull = (board: BoardType) =>
  board.filter((x) => x === null).length === 0;

type SquareProps = {
  value: Player;
  onSquareClick: () => void;
};

const Square = ({ value, onSquareClick }: SquareProps) => {
  return (
    <button
      disabled={value !== null}
      onClick={onSquareClick}
      class="flex items-center hover:bg-slate-300 justify-center p-1 h-6 w-6 border border-black"
    >
      {value}
    </button>
  );
};

export function Board(props: BoardProps) {
  const [board, setBoard] = createSignal(initBoard(props.boardSize));
  const [winner, setWinner] = createSignal<Player | null | undefined>(
    undefined
  );

  let player: Player = "X";

  const handleSquareClick = (index: number) => {
    setBoard((prevSquare) => {
      if (winner() || winner() === null) setWinner(undefined);

      let newBoard = [...prevSquare];
      newBoard[index] = player;
      const won = checkWin(newBoard);
      if (won) {
        console.log(newBoard);
        setWinner(player);
        newBoard = initBoard(props.boardSize);
      } else if (boardFull(newBoard)) {
        newBoard = initBoard(props.boardSize);
        setWinner(null);
      }
      player = player === "X" ? "O" : "X";

      return newBoard;
    });
  };

  createEffect(() => {
    setBoard(initBoard(props.boardSize));
    onCleanup(() => {
      setBoard(initBoard(props.boardSize));
    });
  });

  return (
    <div
      style={{ "grid-template-columns": `repeat(${props.boardSize}, 1fr)` }}
      class={`grid divide-black border-black border-2`}
    >
      <For each={board()}>
        {(square, index) => (
          <Square
            value={square}
            onSquareClick={() => handleSquareClick(index())}
          ></Square>
        )}
      </For>
    </div>
  );
}

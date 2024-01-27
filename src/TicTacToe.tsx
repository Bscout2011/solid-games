import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";

export type BoardSize = 3 | 4;
interface TicTacToeProps {
  boardSize: BoardSize;
}
export type Player = "X" | "O";
export type BoardArray = (Player | null)[];

export const initBoard = (boardSize: BoardSize): BoardArray =>
  Array.from({ length: boardSize ** 2 }, () => null);

export const checkWin = (board: BoardArray): boolean => {
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
    return true;
  }

  return false;
};

const boardFull = (board: BoardArray) =>
  board.filter((x) => x === null).length === 0;

export function TicTacToe() {
  const [boardSize, setBoardSize] = createSignal<BoardSize>(3);
  const [board, setBoard] = createSignal(initBoard(boardSize()));
  const [size, setSize] = createSignal(24);
  const [isOpen, setIsOpen] = createSignal(false);
  const [winner, setWinner] = createSignal<Player | null | undefined>(
    undefined
  );

  createEffect(() => {
    setBoard(initBoard(boardSize()));
    setWinner(undefined);
  });

  let player: Player = "X";

  const handleSquareClick = (index: number) => {
    setBoard((prevSquare) => {
      if (winner() || winner() === null) setWinner(undefined);

      let newBoard = [...prevSquare];
      newBoard[index] = player;
      const won = checkWin(newBoard);
      if (won) {
        setWinner(player);
        newBoard = initBoard(boardSize());
      } else if (boardFull(newBoard)) {
        newBoard = initBoard(boardSize());
        setWinner(null);
      }
      player = player === "X" ? "O" : "X";

      return newBoard;
    });
  };

  return (
    <div class="flex flex-col gap-3 items-center">
      <div class="flex gap-3 items-center">
        <h1 class="text-lg font-medium">Tic Tac Toe</h1>
        <button
          data-testid="board-options-button"
          onClick={() => setIsOpen(!isOpen())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 hover:bg-slate-300 rounded-full"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <div
        data-testid="tic-tac-toe-board"
        style={{ "grid-template-columns": `repeat(${boardSize()}, 1fr)` }}
        class={`grid divide-black border-black border-2`}
      >
        <For each={board()}>
          {(square, index) => (
            <button
              disabled={square !== null}
              onClick={() => handleSquareClick(index())}
              style={{
                height: `${size()}px`,
                width: `${size()}px`,
                "font-size": `${size() / 2}px`,
              }}
              class="flex items-center hover:bg-slate-300 justify-center p-1 border border-black"
            >
              <span>{square}</span>
            </button>
          )}
        </For>
      </div>
      <Show when={winner() !== undefined}>
        <div class="text-3xl">
          {winner() === null ? "Draw" : `${winner()} wins!`}
        </div>
      </Show>
      <Show when={isOpen()}>
        <dialog class="bg-neutral-100 rounded-md border border-black flex flex-col">
          <header class="flex justify-between items-center p-2 border-b gap-2 border-black">
            <h2 class="font-medium text-blue-400">Board Options</h2>
            <button onClick={() => setIsOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>
          <section class="flex flex-col gap-2 p-2">
            <button
              data-testid="board-size-button"
              class="rounded-md border border-gray-300 hover:bg-neutral-300"
              onClick={() => setBoardSize(boardSize() === 3 ? 4 : 3)}
            >
              Board Size {boardSize()}
            </button>
            <select
              data-testid="square-size-select"
              class="rounded-md border border-gray-300 hover:bg-neutral-300"
              onChange={(e) => setSize(parseInt(e.target.value))}
            >
              <option value="24">Small</option>
              <option value="48">Medium</option>
              <option value="96">Large</option>
            </select>
          </section>
        </dialog>
      </Show>
    </div>
  );
}

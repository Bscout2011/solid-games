import { createSignal, type Component } from "solid-js";
import { Board, BoardSize } from "./Board";



const App: Component = () => {
  const [boardSize, setBoardSize] = createSignal<BoardSize>(3);

  const changeBoardSize = () => {
    setBoardSize(boardSize() === 3 ? 4 : 3);
  };

  return (
    <div class="mt-2 flex flex-col items-center justify-center gap-3">
      <h1 class="text-lg font-medium">Tic Tac Toe</h1>
      <button
        class="rounded-md border border-gray-300 hover:bg-neutral-300"
        onClick={changeBoardSize}
      >
        Board Size {boardSize()}
      </button>
      <Board boardSize={boardSize()}></Board>

    </div>
  );
};

export default App;

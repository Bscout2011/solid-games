import { createSignal, type Component, Show } from "solid-js";
import { TicTacToe, BoardSize } from "./TicTacToe";
import { Clock } from "./Clock";

const App: Component = () => {
  const [route, setRoute] = createSignal("tic-tac-toe");

  return (
    <div class="w-screen h-screen flex items-center justify-center">
      <nav class="absolute top-0 left-0 w-full flex items-center bg-black text-white p-2 divide-x-2 divide-gray-600">
        <h1
          class="text-4xl font-bold text-gray-700 cursor-pointer px-3 hover:text-blue-500 "
          onClick={() => setRoute("tic-tac-toe")}
        >
          Tic Tac Toe
        </h1>
        <h1
          class="text-4xl font-bold text-gray-700 cursor-pointer px-3 hover:text-blue-500"
          onClick={() => setRoute("clock")}
        >
          Clock
        </h1>
      </nav>
      <Show when={route() === "tic-tac-toe"}>
        <TicTacToe></TicTacToe>
      </Show>
      <Show when={route() === "clock"}>
        <Clock></Clock>
      </Show>
    </div>
  );
};

export default App;

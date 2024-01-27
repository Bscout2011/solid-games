import { createSignal, type Component } from "solid-js";
import { TicTacToe, BoardSize } from "./TicTacToe";

const App: Component = () => {
  return (
    <div class="w-screen h-screen flex items-center justify-center">
      <TicTacToe></TicTacToe>
    </div>
  );
};

export default App;

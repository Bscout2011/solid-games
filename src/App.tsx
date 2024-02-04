import {
  createSignal,
  type Component,
  Show,
  createEffect,
  For,
} from "solid-js";
import { TicTacToe, BoardSize } from "./TicTacToe";
import { Clock } from "./Clock";

const routes = ["tic-tac-toe", "clock"] as const;
type Route = (typeof routes)[number];

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const App: Component = () => {
  const initialRoute: Route = (localStorage.getItem("route") ??
    routes[0]) as Route;
  const [selectedRoute, setSelectedRoute] = createSignal<Route>(initialRoute);
  createEffect(() => {
    const currentRoute = selectedRoute();
    localStorage.setItem("route", currentRoute);
    document.title =
      currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1);
  });

  return (
    <div class="w-screen h-screen flex items-center justify-center">
      <nav class="absolute top-0 left-0 w-full flex items-center bg-black text-white p-2 divide-x-2 divide-gray-600">
        <For each={routes}>
          {(route) => (
            <h1
              classList={{
                "text-blue-500": selectedRoute() === route,
                "text-gray-700": selectedRoute() !== route,
              }}
              class="text-4xl font-bold cursor-pointer px-3 hover:text-blue-500 "
              onClick={() => setSelectedRoute(route)}
            >
              {titleCase(route)}
            </h1>
          )}
        </For>
      </nav>
      <Show when={selectedRoute() === "tic-tac-toe"}>
        <TicTacToe></TicTacToe>
      </Show>
      <Show when={selectedRoute() === "clock"}>
        <Clock></Clock>
      </Show>
    </div>
  );
};

export default App;

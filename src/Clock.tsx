import { Setter, Show, createEffect, createSignal } from "solid-js";

type ControlProps = {
  idPrefix: string;
  title: string;
  value: number;
  setValue: (value: number) => void;
  disabled: boolean;
};

const Control = (props: ControlProps) => {
  const setValueCallback = (value: number) => {
    if (value < 0 || value > 60) {
      return;
    }
    props.setValue(value);
  };

  return (
    <div class="flex flex-col items-center">
      <div id={`${props.idPrefix}-label`}>{props.title}</div>
      <div class="flex gap-2">
        <button
          id={`${props.idPrefix}-increment`}
          disabled={props.disabled}
          class="rounded-full hover:bg-slate-200 enabled:active:bg-green-500"
          onClick={() => setValueCallback(props.value + 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            />
          </svg>
        </button>
        <div id={`${props.idPrefix}-length`}>{props.value}</div>
        <button
          id={`${props.idPrefix}-decrement`}
          onClick={() => setValueCallback(props.value - 1)}
          disabled={props.disabled}
          class="rounded-full hover:bg-slate-200 enabled:active:bg-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export function Clock() {
  const initialSessionLength = 0;
  const [breakLength, setBreakLength] = createSignal(5);
  const [sessionLength, setSessionLength] = createSignal(initialSessionLength);
  const [secondsLeft, setSecondsLeft] = createSignal(initialSessionLength * 60);
  const [watch, setWatch] = createSignal(false);
  const [startBreak, setStartBreak] = createSignal(true);

  createEffect(() => {
    setSecondsLeft(sessionLength() * 60);
  });

  const startTimer = (minutes?: number) => {
    if (minutes) {
      setSecondsLeft(minutes * 60);
    }
    return setInterval(() => {
      setSecondsLeft((t) => t - 1);
    }, 1000);
  };

  let timerId: NodeJS.Timer | undefined;
  createEffect(() => {
    if (watch()) {
      timerId = startTimer();
    } else {
      clearInterval(timerId);
    }
  });

  createEffect(() => {
    if (secondsLeft() < 0) {
      clearInterval(timerId);
      timerId = startTimer(startBreak() ? breakLength() : sessionLength());
      setStartBreak(!startBreak());
    }
  });

  return (
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-3xl font-medium">25 + 5 Clock</h1>
      <div class="flex items-center gap-12">
        <Control
          idPrefix="break"
          title="Break Length"
          value={breakLength()}
          setValue={setBreakLength}
          disabled={watch()}
        ></Control>
        <Control
          idPrefix="session"
          title="Session Length"
          value={sessionLength()}
          setValue={setSessionLength}
          disabled={watch()}
        ></Control>
      </div>
      <div class="rounded-lg border-4 border-slate-600 p-4 flex flex-col items-center gap-2">
        <div>Session</div>
        <Show when={!startBreak()}>
          <div>Break started ☺️</div>
        </Show>
        <div>
          {Math.floor(secondsLeft() / 60)} :{" "}
          {(secondsLeft() % 60).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          onClick={() => {
            setWatch(!watch());
          }}
          class="rounded-full hover:bg-slate-200 active:bg-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            setWatch(false);
            setSessionLength(initialSessionLength);
            setBreakLength(5);
            setSecondsLeft(60 * initialSessionLength);
            setStartBreak(true);
          }}
          class="rounded-full hover:bg-slate-200 active:bg-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

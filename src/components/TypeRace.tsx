/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  createSignal,
  createMemo,
  onMount,
  For,
  Accessor,
  Show,
} from "solid-js";
import { react, solid } from "./code";

const TypeRace = () => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [typed, setTyped] = createSignal("");
  const [mistakes, setMistakes] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [firstGame, setFirstGame] = createSignal(true);
  const [language, setLanguage] = createSignal();
  const [restart, setRestart] = createSignal(false);

  const codeMixed = () => {
    switch (language()) {
      case "react":
        console.log("react");
        return react.sort(() => Math.random() - 0.5).slice(0, 5);
      case "solid":
        console.log("solid");
        return solid.sort(() => Math.random() - 0.5).slice(0, 5);
      default:
        return react.sort(() => Math.random() - 0.5).slice(0, 5);
    }
  };
  const currentWord: Accessor<string> = createMemo(
    () => codeMixed()[currentIndex()]
  );

  const letters: Accessor<
    { char: string; color: string; isActive: boolean }[]
  > = createMemo(() =>
    currentWord()
      .split("")
      .map((char, index) => ({
        char,
        color:
          index < typed().length
            ? char === typed()[index]
              ? "black"
              : "red"
            : "gray",
        isActive: index === typed().length,
      }))
  );

  onMount(() => {
    window.addEventListener("keydown", handleInputKeyDown);
  });

  const startTime: Accessor<number | undefined> = createMemo(() => Date.now());

  const WPM: Accessor<number> = createMemo(() => {
    const time = (Date.now() - startTime()!) / 1000;
    const words = typed().split("").length;
    return Math.round((words / time) * 60);
  });

  const handleInputKeyDown = (event: KeyboardEvent) => {
    if (isPlaying()) {
      setFirstGame(false);
      const char = event.key.toLowerCase();
      const correctChar = currentWord()[typed().length].toLowerCase() || " ";

      if (char === correctChar) {
        setTyped(typed() + event.key);
        if (typed().length === currentWord().length) {
          if (currentIndex() === codeMixed().length - 1) {
            setIsPlaying(false);
          } else {
            setCurrentIndex(Math.min(currentIndex() + 1, currentIndex() + 5));
            setTyped("");
          }
        }
      } else if (event.key === "Backspace") {
        setTyped(typed().slice(0, -1));
      } else if (event.key === " ") {
        if (correctChar === " ") {
          setTyped(typed() + " ");
        } else {
          setMistakes(mistakes() + 1);
        }
      } else if (event.key === "}" || event.key === ")") {
        if (event.key === correctChar) {
          setTyped(typed() + event.key);
        } else {
          setMistakes(mistakes() + 1);
        }
      } else if (event.key === "Tab") {
        //restart game
        setIsPlaying(false);
        //go to next word
        setCurrentIndex(Math.min(currentIndex() + 1, currentIndex() + 5));
        setRestart(true);
      } else if (
        char !== correctChar &&
        event.key !== " " &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        event.key !== "Enter" &&
        event.key !== "Dead" &&
        event.key !== "CapsLock" &&
        !/^[0-9]$/.test(event.key) &&
        !/Arrow|'/.test(event.key) &&
        !/[^\w\s]/.test(char)
      ) {
        setMistakes(mistakes() + 1);
        if (typed().length === currentWord().length) {
          setCurrentIndex(Math.min(currentIndex() + 1, currentIndex() + 5));
          setTyped("");
        } else {
          setTyped(typed() + event.key);
        }
      }
    } else if (event.key === " " && language()) {
      setIsPlaying(true);
      setRestart(false);
      setCurrentIndex(0);
      setTyped("");
      setMistakes(0);
    }
  };

  return (
    <div class="items-center text-center text-word justify-between  flex-col flex rounded-3xl">
      {isPlaying() ? (
        <>
          <h1 class="">
            <For each={letters()}>
              {({ char, color, isActive }) => (
                <span class={isActive ? "active" : ""} style={{ color }}>
                  {char}
                </span>
              )}
            </For>
          </h1>
          <div class="flex flex-row gap-12">
            <h2 class="text-word">Miss: {mistakes()}</h2>
            <h2 class="text-word">WPM: {WPM()}</h2>
          </div>
        </>
      ) : (
        <>
          {firstGame() ? (
            <>
              <Show when={language()}>
                <h1 class="text-word">Press space to start</h1>
              </Show>
              <Show when={!language()}>
                <label for="countries" class="block mb-2 font-base">
                  Select an option
                </label>
                <select
                  id="countries"
                  onChange={(e) => setLanguage(e.target.value)}
                  class="border-4 text-base rounded-lg block w-full p-2.5 "
                >
                  <option selected>Choose language</option>
                  <option value="react">React</option>
                  <option value="solid">Solid</option>
                </select>
              </Show>
            </>
          ) : (
            <>
              {restart() ? (
                <>
                  <h1>Press space to start over</h1>
                </>
              ) : (
                <>
                  <h1 class="text-word">Game Over</h1>
                  <h1 class="text-word text-black">Press space to restart</h1>
                  <div class="flex flex-row gap-12">
                    <h2 class="text-word">Mistakes: {mistakes()}</h2>
                    <h2 class="text-word">WPM: {WPM()}</h2>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TypeRace;

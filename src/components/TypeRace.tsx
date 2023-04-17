/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  createSignal,
  createMemo,
  onMount,
  For,
  Accessor,
  Show,
  createEffect,
} from "solid-js";
import { react, solid, vanila } from "./code";
import { supabase } from "../client";
import { UserMetadata } from "@supabase/supabase-js";

const TypeRace = (__user?: UserMetadata) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [typed, setTyped] = createSignal("");
  const [mistakes, setMistakes] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [firstGame, setFirstGame] = createSignal(true);
  const [language, setLanguage] = createSignal();
  const [restart, setRestart] = createSignal(false);
  const [time, setTime] = createSignal(0);
  const [canWrite, setCanWrite] = createSignal(false);

  const handleLanguage = (lang: string[]): string[] => {
    return lang.sort(() => Math.random() - 0.5).slice(0, 1);
  };

  const codeMixed = (): string[] => {
    switch (language()) {
      case "react":
        return handleLanguage(react);
      case "solid":
        return handleLanguage(solid);
      case "vanila":
        return handleLanguage(vanila);
      default:
        return handleLanguage(react);
    }
  };

  const [currentLetterIndex, setCurrentLetterIndex] = createSignal(0);

  createEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentLetterIndex((index) =>
        index < letters().length ? index + 1 : index
      );
    }, 100);

    return () => clearInterval(intervalId);
  });

  createEffect(() => {
    setCanWrite(currentLetterIndex() === letters().length);
  });

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

  let timer;

  const checkUserData = async () => {
    const { data, error } = await supabase
      .from("Leaderboard")
      .select("*")
      .eq("player_name", __user?.__user.user_name);

    if (data?.length === 0) {
      supabase.from("Leaderboard").insert([
        {
          player_name: __user?.__user.user_name,
          best_time: time(),
          miss: mistakes(),
        },
      ]);
    }
    if (data?.length !== 0) {
      if (data[0].miss > mistakes()) {
        if (data[0].best_time > time()) {
          supabase
            .from("Leaderboard")
            .update({ best_time: time(), miss: mistakes() })
            .eq("player_name", __user?.__user.user_name)
            .then((res) => {});
        }
      }
    }
    if (error) console.log(error);
  };

  let x: boolean = true;
  const handleInputKeyDown = (event: KeyboardEvent) => {
    if (isPlaying() && canWrite()) {
      if (x) {
        timer = setInterval(() => {
          setTime(Math.round((time() + 0.1) * 100) / 100);
        }, 100);
        x = false;
      }
      setFirstGame(false);
      const char = event.key.toLowerCase();
      const correctChar: string =
        currentWord()[typed().length].toLowerCase() || " ";

      if (char === correctChar) {
        setTyped(typed() + event.key);
        if (typed().length === currentWord().length) {
          if (currentIndex() === codeMixed().length - 1) {
            clearInterval(timer);
            setIsPlaying(false);
            if (__user) {
              checkUserData();
            }
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
        setIsPlaying(false);
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
    <div class="items-center text-center text-word justify-between flex-col flex rounded-3xl">
      {isPlaying() ? (
        <>
          <h1 class="">
            {canWrite() ? (
              <For each={letters()}>
                {({ char, color, isActive }, index) => (
                  <span class={isActive ? "act" : ""} style={{ color }}>
                    {char}
                  </span>
                )}
              </For>
            ) : (
              <For each={letters().slice(0, currentLetterIndex())}>
                {({ char, color, isActive }, index) => (
                  <span class={isActive ? "act" : ""} style={{ color }}>
                    {char}
                  </span>
                )}
              </For>
            )}
          </h1>
          <div class="flex flex-row gap-12">
            <h2 class="text-word">Miss: {mistakes()}</h2>
            <h2 class="text-word">WPM: {time()}</h2>
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
                  <option value="vanila">Vanila</option>
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
                  <div class="flex flex-row gap-12">
                    <h2 class="text-word">Mistakes: {mistakes()}</h2>
                    <h2 class="text-word">Time: {time()}</h2>
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

import { createSignal, onMount } from "solid-js";
import { supabase } from "../client";

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = createSignal<any>([]);

  const getData = async () => {
    const { data } = await supabase.from("Leaderboard").select("*");
    setLeaderboard(data);
  };

  onMount(() => {
    getData();
  });

  const sortLeaderboard = () => {
    return leaderboard().sort((a: any, b: any) => b.best_time - a.best_time);
  };

  return (
    <>
      <div
        class="text-black text-center"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1 class="text-word">Leaderboard</h1>
        <div class="flex flex-row justify-between">
          <p class="text-3xl">Player</p>
          <p class="text-3xl">Time</p>
        </div>
        <div class="h-[2px] bg-red-400 mb-16" />
        <div class="flex flex-col gap-4">{
          sortLeaderboard().map((item: any) => {
            return (
              <div class="flex flex-row justify-between">
                <p class="text-2xl">{item.player_name}</p>
                <p class="text-2xl">{item.best_time}</p>
              </div>
            );
          })
        }</div>
      </div>
    </>
  );
};

export default LeaderBoard;

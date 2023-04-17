import { createSignal, onMount } from "solid-js";
import { supabase } from "../client";
import { UserMetadata } from "@supabase/supabase-js";

const LeaderBoard = (__user?: UserMetadata) => {
  const [leaderboard, setLeaderboard] = createSignal<any>([]);

  const getData = async () => {
    const { data } = await supabase.from("Leaderboard").select("*");
    setLeaderboard(data);
  };

  onMount(() => {
    getData();
  });

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
          <p class="text-3xl">Mistakes</p>
        </div>
        <div class="h-[2px] bg-red-400 mb-16" />
        <div class="flex flex-col gap-4">
          {leaderboard().map((item: any) => {
            return (
              <div class="flex flex-row justify-between">
                {item.player_name === __user.__user.user_name ? (
                  <p class="text-2xl text-red-500">{item.player_name}</p>
                ) : (
                  <p class="text-2xl">{item.player_name}</p>
                )}
                <p class="text-2xl">{item.best_time}</p>
                <p class="text-2xl">{item.miss}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;

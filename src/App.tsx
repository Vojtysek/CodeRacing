import Footer from "./components/Footer";
import TypeRace from "./components/TypeRace";
import LogOut from "./components/LogOut";

import { NavLink, Route, Routes } from "solid-app-router";
import { createStore } from "solid-js/store";
import { onMount, createSignal } from "solid-js";

import logo from "./assets/icon.svg";

import { BiRegularHelpCircle } from "solid-icons/bi";
import { IoExitOutline } from "solid-icons/io";
import { FaSolidClipboardList } from "solid-icons/fa";

import { UserMetadata } from "@supabase/supabase-js";
import { supabase } from "./client";
import Helper from "./components/Helper";
import LeaderBoard from "./components/LeaderBoard";

export default function Home() {
  const [helper, setHelper] = createSignal(false);
  const [leaderBoard, setLeaderBoard] = createSignal(false);
  const [loading, setLoading] = createSignal<boolean>();
  const [user, setUser] = createStore<UserMetadata>();

  onMount(async () => {
    setLoading(true);
    await checkUser();
    window.addEventListener("haschange", async function () {
      await checkUser();
      setLoading(false);
    });
    setLoading(false);
  });

  async function checkUser() {
    const _user = await (
      await supabase.auth.getUser()
    ).data.user?.user_metadata;
    if (_user) {
      setUser(_user);
      localStorage.setItem("username", JSON.stringify(_user.user_name));
    }
  }

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  }

  const handleHelper = (): void => {
    setHelper(!helper());
  };

  const handleLeaderBoard = (): void => {
    setLeaderBoard(!leaderBoard());
  };

  const Navbar = () => {
    return (
      <div class="text-black p-12 flex flex-row justify-between w-screen">
        <NavLink href="/">
          <img src={logo} alt="logo" />
        </NavLink>
        {user?.user_name ? (
          <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col text-2xl justify-between gap-4 items-center">
              <p>
                Welcome
                <span class="text-red-500"> {user.user_name}</span>
              </p>
            </div>
            <NavLink class="flex flex-row gap-2 items-center" href="/logout">
              Log Out
              <IoExitOutline size={25} />
            </NavLink>
            <Routes>
              <Route path="/logout" element={<LogOut />} />
            </Routes>
          </div>
        ) : (
          <button onClick={signIn} class="text-2xl">
            Login with Github
          </button>
        )}
        <div class="flex gap-4">
          <NavLink href="/helper">
            <BiRegularHelpCircle
              class="cursor-pointer"
              size={50}
              color="black"
            />
          </NavLink>
          {user?.user_name ? (
            <NavLink href="/leaderboard">
              <FaSolidClipboardList
                class="cursor-pointer"
                size={50}
                color="black"
              />
            </NavLink>
          ) : null}
          <Routes>
            <Route path="/helper" element={<Helper />} />
            <Route
              path="/leaderboard"
              element={<LeaderBoard __user={user} />}
            />
          </Routes>
        </div>
      </div>
    );
  };

  return (
    <div class="w-screen h-screen">
      {loading() ? (
        <div class="flex items-center justify-center w-screen h-screen flex-col gap-12">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400"></div>
          <h1 class="text-4xl font-bold text-black">Loading...</h1>
        </div>
      ) : (
        <>
          <div class="h-1/6">
            <Navbar />
          </div>
          <main class="items-center w-screen h-2/3 flex justify-center flex-col">
            <Routes>
              <Route path="/" element={<TypeRace __user={user} />} />
            </Routes>
            <Footer />
          </main>
        </>
      )}
    </div>
  );
}

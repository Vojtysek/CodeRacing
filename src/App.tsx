import Footer from "./components/Footer";
import TypeRace from "./components/TypeRace";

import logo from "./assets/icon.svg";
import { BiRegularHelpCircle } from "solid-icons/bi";
import { createSignal } from "solid-js";

export default function Home() {
  const [helper, setHelper] = createSignal(false);

  const handleHelper = () => {
    setHelper(!helper());
  };

  const Navbar = () => {
    return (
      <div class="text-black p-12 flex flex-row justify-between w-screen">
        <img src={logo} alt="logo" />
        <BiRegularHelpCircle onClick={handleHelper} size={50} color="black" />
      </div>
    );
  };

  return (
    <>
      <div class="absolute">
        <Navbar />
      </div>
      <main class="items-center w-screen h-screen text-gray-400 flex justify-center flex-col">
        {!helper() ? (
          <TypeRace />
        ) : (
          <>
            <div class="text-black text-center">
              <p class="text-2xl">How to play?</p>
              <p class="text-3xl">
                Type the words that appear on the screen as fast as you can.
              </p>
            </div>
          </>
        )}
        <Footer />
      </main>
    </>
  );
}

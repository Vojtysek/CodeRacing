import { supabase } from "../client";
import { onMount, createSignal } from "solid-js";

const LogOut: any = () => {
  const [lgOut, setLgOut] = createSignal<boolean>();

  onMount(async () => {
    await supabase.auth.signOut();
    setLgOut(false);
    localStorage.removeItem("user");
    setLgOut(true);
    location.href = "/";
  });
};

export default LogOut;

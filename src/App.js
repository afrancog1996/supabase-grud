import "./index.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function Home() {
  const [session, setSession] = useState(null);
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <ThemeProvider theme={darkTheme}>
        {!session ? (
          <Auth />
        ) : (
          <Account key={session.user.id} session={session} />
        )}
      </ThemeProvider>
    </div>
  );
}

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Account from "./Account";
import Auth from "./Auth";
import "./index.css";
import { supabase } from "./supabaseClient";

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

import { Box, Button, Input } from "@mui/material";
import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 className="header">Supabase + React</h1>
      <p className="description">
        Sign in via magic link with your email below
      </p>
      <div>
        <Input
          className="inputField"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className={"button block"}
          disabled={loading}
        >
          {loading ? <span>Loading</span> : <span>Send magic link</span>}
        </Button>
      </div>
    </Box>
  );
}

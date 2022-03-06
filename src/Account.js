import { Box, Button, Input } from "@mui/material";
import { useEffect, useState } from "react";
import Avatarimg from "./Avatar";
import { supabase } from "./supabaseClient";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);
  const [recordDate, setRecordDate] = useState(new Date());
  const [creationDate, setCreationDate] = useState(null);
  const [isFetch, setIsFetch] = useState(false);
  const [recordID, setRecordID] = useState(null);
  const [userid] = useState(supabase.auth.user());
  const [listRecords, setListRecords] = useState(null);

  useEffect(() => {
    if (avatar_url) downloadImage(avatar_url);
    getProfile();
    listrecord();
  }, [session, avatar_url, isFetch]);

  async function downloadImage(path) {
    try {
      const { error } = await supabase.storage.from("avatars").download(path);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (user) {
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", user.id)
          .single();
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRecord() {
    try {
      const { error } = await supabase
        .from("recordatorios")
        .delete()
        .eq("id", recordID);
      if (error) {
        throw error;
      } else {
        setIsFetch(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsFetch(false);
    }
  }

  async function updateProfile(username, website, avatar_url) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (user) {
        const updates = {
          id: user.id,
          username,
          website,
          avatar_url,
          updated_at: new Date(),
        };

        let { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        });

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function insertRecord(title, content, reminder) {
    console.log(title);
    console.log(content);
    console.log(recordID);
    if (recordID !== null && recordID !== "") {
      updateReminder();
    } else {
      try {
        const userid = supabase.auth.user();
        if (userid) {
          const updates = {
            user: userid.id,
            title,
            content,
            reminder: recordDate,
            created_at: new Date(),
          };

          let { error } = await supabase.from("recordatorios").insert(updates, {
            returning: "minimal", // Don't return the value after inserting
          });

          if (error) {
            throw error;
          } else {
            setIsFetch(true);
          }
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setIsFetch(false);
      }
    }
  }

  async function updateReminder() {
    try {
      const user = userid;

      if (user) {
        const updates = {
          id: recordID,
          user: user.id,
          title: title,
          content: content,
          reminder: recordDate,
          created_at: new Date(),
        };

        let { error } = await supabase.from("recordatorios").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        });

        if (error) {
          throw error;
        } else {
          setIsFetch(true);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsFetch(false);
    }
  }
  async function listrecord() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (user) {
        let { data, error, status } = await supabase
          .from("recordatorios")
          .select(`*`)
          .eq("user", user.id);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setListRecords(data);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getRecord() {
    try {
      let { data, error, status } = await supabase
        .from("recordatorios")
        .select(`*`)
        .eq("id", recordID)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setRecordDate(data.reminder);
        setCreationDate(data.created_at);
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatarimg
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />
          <Box>
            <label htmlFor="email">Email: </label>
            <Input id="email" type="text" value={session.user.email} disabled />
          </Box>
          <Box>
            <label htmlFor="username">Name: </label>
            <Input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>
          <Box>
            <label htmlFor="website">Website: </label>
            <Input
              id="website"
              type="website"
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Box>

          <Box>
            <Button
              className="button block primary"
              onClick={() => updateProfile({ username, website, avatar_url })}
              disabled={loading}
            >
              {loading ? "Loading ..." : "Update"}
            </Button>
          </Box>

          <Box>
            <Button
              className="button block"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>CRUD DE RECORDS</h1>
          <Box>
            <label htmlFor="idfield">Id: </label>
            <Input
              id="idfield"
              type="text"
              onChange={(e) => setRecordID(e.target.value)}
            />

            <Button
              className="button primary block"
              onClick={() => getRecord()}
            >
              Buscar
            </Button>
          </Box>
          <Box>
            <label htmlFor="title">Título: </label>
            <Input
              id="title"
              type="text"
              placeholder="Título"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
          <Box>
            <label htmlFor="content">Contenido: </label>
            <Input
              id="content"
              type="text"
              value={content || ""}
              onChange={(e) => setContent(e.target.value)}
            />
          </Box>
          <Box>
            <label htmlFor="creationDate">Fecha de creacion: </label>
            <input
              id="creationDate"
              type="text"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              disabled={true}
            />
          </Box>
          <Box>
            <label htmlFor="reminderdate">Fecha: </label>
            <input
              id="reminderdate"
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
            />
          </Box>

          <Box>
            <Button
              className="button block primary"
              onClick={() => insertRecord(title, content, recordDate)}
            >
              {recordID !== null && recordID !== "" ? "Actualizar" : "Agregar"}
            </Button>
          </Box>

          <Box>
            <Button
              className="button block primary"
              onClick={() => deleteRecord()}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </Box>

      <Box>
        <h1>LISTA DE RECORDS</h1>
        {listRecords !== null
          ? listRecords.map((t) => (
              <li key={t.id}>
                {" "}
                ID: {t.id} Titulo: {t.title} - Contenido: {t.content} - Fecha de
                recordatorio: {t.reminder} - Fecha de creacion: {t.created_at} -
              </li>
            ))
          : ""}
      </Box>
    </Box>
  );
}

import "../Appointments.css";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
//TODO: HANDLE 'checking overlap' of games an umpire is assigned to
// My components
import Umpires from "../AppointmentsComponent/Umpires";
import Games from "../AppointmentsComponent/Games";

import parseUmpire from "../AppointmentsComponent/parseUmpires";
import Instructions from "../AppointmentsComponent/Instructions";
import FloatingBox from "../AppointmentsComponent/FloatingBox";
import UploadCsv from "../AppointmentsComponent/UploadCsv";
import UseSql from "../AppointmentsComponent/UseSql";

const GAME_LENGTH_MIN = 60;

function App({ isAuthenticated }) {
  let [highlightType, setHighlightType] = useState("umpire");
  let [selectedGame, setSelectedGame] = useState({});
  let [selectedUmpire, setSelectedUmpire] = useState({});

  let [useSql, setUseSql] = useState(
    JSON.parse(
      localStorage.getItem("useSql") ? isAuthenticated : false || false
    )
  );

  // CSV files/localStorage modify these
  let [games, setGames] = useState(
    JSON.parse(localStorage.getItem("games") || "[]")
  );
  let [umpires, setUmpires] = useState(
    JSON.parse(localStorage.getItem("umpires") || "[]")
  );

  // Load umpire entries from SQL
  useEffect(() => {
    if (isAuthenticated !== true) {
      setUseSql(false);
      localStorage.setItem("useSql", JSON.stringify(false));
      return;
    }

    let fetchData = async () => {
      if (useSql === true) {
        fetch("/api/umpires")
          .then((data) => {
            setUmpires(data);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchData();
  }, [useSql, isAuthenticated]);

  localStorage.setItem("games", JSON.stringify(games));
  localStorage.setItem("umpires", JSON.stringify(umpires));

  let parsedUmpires = umpires.map((umpire) => {
    return {
      ...umpire,
      blockedGames: parseUmpire(umpire, games, GAME_LENGTH_MIN),
    };
  });

  return (
    <Box className="App">
      <h1>Appointments</h1>
      <Instructions setGames={setGames} setUmpires={setUmpires} />
      <br />
      <UseSql
        useSql={useSql}
        setUseSql={setUseSql}
        isAuthenticated={isAuthenticated}
      />
      <UploadCsv
        setGames={setGames}
        setUmpires={setUmpires}
        games={games}
        useSql={useSql}
      />
      {/* Print games */}
      <h1>Games</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Games
          games={games}
          setGames={setGames}
          highlightType={highlightType}
          setSelectedGame={setSelectedGame}
          selectedUmpire={selectedUmpire}
        ></Games>
      </Box>
      <br />

      {/* Umpires list and information */}
      <h1>Umpire Profiles</h1>
      <Box
        sx={{
          py: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Umpires
          umpires={parsedUmpires}
          highlightType={highlightType}
          setSelectedUmpire={setSelectedUmpire}
          selectedGame={selectedGame}
        ></Umpires>
      </Box>

      {/* Floating box with controls, selection, and 'undo' box */}
      <FloatingBox
        highlightType={highlightType}
        selectedUmpire={selectedUmpire}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        setSelectedUmpire={setSelectedUmpire}
        setHighlightType={setHighlightType}
      />
    </Box>
  );
}

export default App;

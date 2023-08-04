import "./App.css";
import { Button } from "@mui/material";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import CsvDownloadButton from "react-json-to-csv";

// My components
import Umpires from "./Umpires";
import Games from "./Games";

import parseUmpire from "./parseUmpires";
import { csvToGame, csvToUmpire, gameToPlayHQ } from "./utils";
import Instructions from "./Instructions";
import FloatingBox from "./FloatingBox";

const GAME_LENGTH_MIN = 60;

function App() {
  let [highlightType, setHighlightType] = useState("umpire");
  let [selectedGame, setSelectedGame] = useState({});
  let [selectedUmpire, setSelectedUmpire] = useState({});
  let [useSql, setUseSql] = useState(
    JSON.parse(localStorage.getItem("useSql") || "false")
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
  }, [useSql]);

  /**
   * Upload umpire profiles from CSV
   * @param {*} event
   */
  const handleUmpiresUpload = (event) => {
    const file = event.target.files[0];

    // Parse contents
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let umpireList = [];
        for (const umpire of results.data) {
          umpireList.push(csvToUmpire(umpire));
        }

        localStorage.setItem("umpires", JSON.stringify(umpireList));
        setUmpires(Array.from(umpireList));
      },
    });
  };

  /**
   *  Overwrite games from new CSV
   * Load Games from a CSV file in playerHQ format
   */
  const handleGamesUpload = (event) => {
    const file = event.target.files[0];
    // Parse contents
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let gameList = [];
        for (const game of results.data) {
          //Add extra entries to game info
          if (game["bye"] && game.bye !== "") continue; //Bye row
          gameList.push(csvToGame(game));
        }

        localStorage.setItem("games", JSON.stringify(gameList));
        setGames(Array.from(gameList));
      },
    });
  };

  /**
   * Concat games instead of overwriting
   * @param {*} event
   */
  const addSecondCSV = (event) => {
    const file = event.target.files[0];

    // Parse contents
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let gameList = [];
        for (const game of results.data) {
          //Add extra entries to game info

          if (game["bye"] && game.bye !== "") continue; //Bye row

          gameList.push(csvToGame(game));
        }

        setGames(Array.from(games.concat(gameList)));
      },
    });
  };

  localStorage.setItem("games", JSON.stringify(games));
  localStorage.setItem("umpires", JSON.stringify(umpires));

  let parsedUmpires = umpires.map((umpire) => {
    return {
      ...umpire,
      blockedGames: parseUmpire(umpire, games, GAME_LENGTH_MIN),
    };
  });

  return (
    <div className="App">
      <Instructions
        handleGamesUpload={handleGamesUpload}
        handleUmpiresUpload={handleUmpiresUpload}
      />
      <br />

      {/* CSV Upload container */}
      <div className="py-5 container">
        <div className="py-4 d-flex border border-3 rounded justify-content-lg-evenly ">
          <div>
            <h2>Umpires CSV</h2>
            <input type="file" accept=".csv" onChange={handleUmpiresUpload} />
          </div>

          <div className="py-2">
            <h2>Games CSV</h2>
            <input type="file" accept=".csv" onChange={handleGamesUpload} />
            <h4 className="mt-3">(Optional) More Games</h4>
            <input type="file" accept=".csv" onChange={addSecondCSV} />
          </div>
          <div>
            <CsvDownloadButton
              filename="allocations.csv"
              delimiter=","
              className="btn btn-lg btn-primary"
              data={games.map((game) => gameToPlayHQ(game))}
            >
              Save Current Allocations
            </CsvDownloadButton>
          </div>
        </div>
      </div>

      {/* Print games */}
      <h1>Games</h1>
      <div className="d-flex flex-column align-items-center justify-content-center ">
        <Games
          games={games}
          setGames={setGames}
          highlightType={highlightType}
          setSelectedGame={setSelectedGame}
          selectedUmpire={selectedUmpire}
        ></Games>
      </div>
      <br />

      {/* Umpires list and information */}
      <h1>Umpire Profiles</h1>
      <div className="py-3 d-flex flex-row justify-content-center ">
        <Umpires
          umpires={parsedUmpires}
          highlightType={highlightType}
          setSelectedUmpire={setSelectedUmpire}
          selectedGame={selectedGame}
        ></Umpires>
      </div>

      {/* Floating box with controls, selection, and 'undo' box */}
      <FloatingBox
        highlightType={highlightType}
        selectedUmpire={selectedUmpire}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        setSelectedUmpire={setSelectedUmpire}
        setHighlightType={setHighlightType}
      />
    </div>
  );
}

export default App;

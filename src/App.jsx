import "./App.css";
import { Button } from "react-bootstrap";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import CsvDownloadButton from "react-json-to-csv";

// My components
import Umpires from "./Umpires";
import Games from "./Games";

import example_games from "./example-games.csv"
import example_umpires from "./example-umpires.csv"

import parseUmpire from "./parseUmpires";
import { csvToGame, csvToUmpire, gameToPlayHQ } from "./utils";

const GAME_LENGTH_MIN = 60;

/**
 * Loads a file from the static location, and puts it into the right format for 'handleXUpload' to use it
 * @param {*} fileName - File in 'public' to read
 * @param {*} callback - 'handleXUpload' function
 * @returns event.target.files[0] <- file in here
 */
function loadLocalFile(fileName, callback) {
  return fetch(fileName)
    .then((response) => response.text())
    .then((fileContent) => {
      const event = {
        target: {
          files: [fileContent],
        },
      };

      callback(event); // Pass the event to the callback function
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function App() {
  let [highlightType, setHighlightType] = useState("umpire");
  let [selectedGame, setSelectedGame] = useState({});
  let [selectedUmpire, setSelectedUmpire] = useState({});
  let [useSql, setUseSql] = useState<Boolean>(JSON.parse(localStorage.getItem("useSql") || "false"))

  // CSV files/localStorage modify these
  let [games, setGames] = useState(
    JSON.parse(localStorage.getItem("games") || "[]")
  );
  let [umpires, setUmpires] = useState(
    JSON.parse(localStorage.getItem("umpires") || "[]")
  );

  // Load umpire entries from SQL
  useEffect(async () => {
    if (useSql === true) {
      fetch("/api/umpires").then(data => {
        setUmpires(data)
      }).catch(err => console.log(err))
    }
  }, [useSql])

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
          if (game.hasOwnProperty("bye") && game.bye !== "") continue; //Bye row
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

          if (game.hasOwnProperty("bye") && game.bye !== "") continue; //Bye row

          gameList.push(csvToGame(game));
        }

        setGames(Array.from(games.concat(gameList)));
      },
    });
  };

  /**
   * Drag and drop handling
   * @param {*} event - Drag start event object, this is given to the Drop event
   */
  const handleDragStartOfEmpty = (event) => {
    event.dataTransfer.setData("umpire", JSON.stringify({}));
  };

  /**
   * Demo data loading
   */
  let loadExamples = () => {
    loadLocalFile(example_games, handleGamesUpload);
    loadLocalFile(example_umpires, handleUmpiresUpload);
  };

  // Drag and drop handling
  const handleDragStart = (event, umpire) => {
    event.dataTransfer.setData("umpire", JSON.stringify(umpire));
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
      <div className="container">
        <h2>How to use:</h2>
        <br />- This is a <b>drag and drop</b> system, you drag and drop the
        desired umpire profile into the umpire 1 or umpire 2 column to
        'allocate'/'appoint' them
        <br />- Click on an umpire to see which games they are 'unavailable' for
        - or alternatively, click '<b>filter by game</b>' to see umpires who are
        unavailable for a specific game
        <br />- <b>Unavailable</b> games will show in red
        <br />
        - Load the games in with the following file inputs (or click 'Load demo
        data' to play around)
        <br />
        - When you load data, any changes/data loaded should be saved if you
        reload the page
        <br />- If you need to undo/clear an allocation/appointment, drag and
        drop the special '<b>Drap/Drop me</b>' box onto it
        <br />
        <i>
          Note: 'Teams' of an umpire mean they cannot be umpiring during those
          teams' games - i.e. playing, coaching, managing, etc.
        </i>
        <div className="py-2">
          <Button className="btn btn-sm" onClick={loadExamples}>
            Load Demo Data
          </Button>
        </div>
      </div>
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
      <div
        className="sticky-bottom py-3 container-sm d-flex justify-content-center"
        style={{ width: "auto", pointerEvents: "none" }}
      >
        <div
          className=" control-panel p-3 border border-dark rounded"
          style={{ pointerEvents: "auto" }}
        >
          <div className="pb-2">
            <b>Checking availability for: </b>
            {highlightType === "game" ? (
              selectedGame.hasOwnProperty("A") ? (
                selectedGame.Date +
                "@" +
                selectedGame.Time +
                " - " +
                selectedGame.A +
                " vs " +
                selectedGame.B
              ) : (
                "None"
              )
            ) : selectedUmpire.hasOwnProperty("Name") ? (
              <span
                className="border border-1 border-dark rounded p-1"
                draggable
                onDragStart={(event) => {
                  handleDragStart(event, selectedUmpire);
                }}
              >
                {selectedUmpire.Name +
                  " - Levels: " +
                  selectedUmpire.Levels +
                  " - Teams: " +
                  selectedUmpire.Teams}
              </span>
            ) : (
              "None"
            )}
          </div>
          <div draggable onDragStart={handleDragStartOfEmpty} className="mt-2">
            <i className="border border-dark rounded p-1">
              Drag/Drop me to clear an allocation
            </i>
          </div>

          <div className="py-2">
            <div className="py-1">
              <div className="pb-2">
                <b>Filtering by: </b>
                {highlightType === "game"
                  ? "Game"
                  : highlightType === "umpire"
                  ? "Umpire"
                  : "-"}
              </div>
              <Button
                className="btn-sm mx-2"
                onClick={() => {
                  setHighlightType("umpire");
                  setSelectedGame({});
                }}
              >
                Filter by Umpire
              </Button>
              <Button
                className="btn-sm mx-2"
                onClick={() => {
                  setHighlightType("game");
                  setSelectedUmpire({});
                }}
              >
                Filter by Game
              </Button>
            </div>
            <Button
              className="btn-sm mx-2"
              onClick={() => {
                setSelectedUmpire({});
                setSelectedGame({});
              }}
            >
              Clear Unavailabilities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { Box } from "@mui/material";
import * as Papa from "papaparse";
import CsvDownloadButton from "react-json-to-csv";
import { csvToUmpire, gameToPlayHQ, csvToGame } from "./utils";

export default function UploadCsv({ setUmpires, setGames, games, useSql }) {
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

  return (
    <Box sx={{ py: 5, container: 1, border: 1, borderRadius: 4 }}>
      <Box sx={{ py: 4, display: "flex", justifyContent: "space-evenly" }}>
        {useSql ? (
          ""
        ) : (
          <>
            {/* Save current allocations */}
            <Box>
              <CsvDownloadButton
                filename="allocations.csv"
                delimiter=","
                data={games.map((game) => gameToPlayHQ(game))}
              >
                Save Current Allocations
              </CsvDownloadButton>
            </Box>
            <Box>
              <h2>Umpires CSV</h2>
              <input type="file" accept=".csv" onChange={handleUmpiresUpload} />
            </Box>
          </>
        )}

        <Box sx={{ py: 2 }}>
          <h2>Games CSV</h2>
          <input type="file" accept=".csv" onChange={handleGamesUpload} />
        </Box>
      </Box>
    </Box>
  );
}

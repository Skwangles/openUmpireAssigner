import { Button, Box } from "@mui/material";

let Instructions = ({ setUmpires, setGames }) => {
  /**
   * Demo data loading
   */
  let loadExamples = () => {
    loadLocalFile("example-games", handleGamesUpload);
    loadLocalFile("example-umpires", handleUmpiresUpload);
  };

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

  //TODO: REMOVE THE REPEATED handleXUpload FUNCTIONS
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
    <Box sx={{ container: 1 }}>
      <h2>How to use:</h2>
      <br />- This is a <b>drag and drop</b> system, you drag and drop the
      desired umpire profile into the umpire 1 or umpire 2 column to
      'allocate'/'appoint' them
      <br />- Click on an umpire to see which games they are 'unavailable' for -
      or alternatively, click '<b>filter by game</b>' to see umpires who are
      unavailable for a specific game
      <br />- <b>Unavailable</b> games will show in red
      <br />
      - Load the games in with the following file inputs (or click 'Load demo
      data' to play around)
      <br />
      - When you load data, any changes/data loaded should be saved if you
      reload the page
      <br />- If you need to undo/clear an allocation/appointment, drag and drop
      the special '<b>Drap/Drop me</b>' box onto it
      <br />
      <i>
        Note: 'Teams' of an umpire mean they cannot be umpiring during those
        teams' games - i.e. playing, coaching, managing, etc.
      </i>
      <Box sx={{ py: 2 }}>
        <Button variant="contained" onClick={loadExamples}>
          Load Demo Data
        </Button>
      </Box>
    </Box>
  );
};

export default Instructions;

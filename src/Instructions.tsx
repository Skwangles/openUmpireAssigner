import { Button, Box } from "@mui/material";
import example_games from "./example-games.csv";
import example_umpires from "./example-umpires.csv";

let Instructions = (props) => {
  let { handleGamesUpload, handleUmpiresUpload } = props;
  /**
   * Demo data loading
   */
  let loadExamples = () => {
    loadLocalFile(example_games, handleGamesUpload);
    loadLocalFile(example_umpires, handleUmpiresUpload);
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

import Game from "./Game";
import {
  dateStringComparison,
  gameToId,
  gradeComparison,
  timeComparison,
} from "./utils.js";
import "./Games.css";
import { useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";

/**
 * Displays games - grays out non-available games
 * @param {*} props - Contains all the props needed to display, filter, etc
 * @returns
 */
function Games({
  games,
  highlightType,
  setGames,
  setSelectedGame,
  selectedUmpire,
}) {
  let [searchTerms, setSearchTerms] = useState<string[]>([]);
  let [sortByTime, setSortByTime] = useState<boolean>(true); // True

  // Update overall game object
  let updateGameValue = (key, newGame) => {
    let indexOfGame = -1;

    // Find index matching
    for (const index in games) {
      let item = games[index];
      if (gameToId(item) === key) {
        indexOfGame = index;
        break;
      }
    }
    if (indexOfGame < 0) return false;

    //Update game object
    games[indexOfGame] = newGame;
    setGames(games);
  };

  // Disable games by umpire
  if (highlightType === "umpire" && !!selectedUmpire?.hasOwnProperty("Name")) {
    games = games.map((game) => {
      // Check if umpire disabled for game & attach reason
      let invalidGame = selectedUmpire.blockedGames?.find(
        (checkedGame) => gameToId(game) === gameToId(checkedGame)
      );
      if (invalidGame !== undefined)
        return {
          ...game,
          isUnavailable: true,
          reason: invalidGame.reason || "None",
        };

      return { ...game, isUnavailable: false };
    });
  } else {
    games = games.map((game) => {
      return { ...game, isUnavailable: false };
    });
  }

  // Filter games by search terms - do before hand, so '0 games' is handled
  games = games.filter((game) => {
    // ALL search terms must match
    for (const rawTerm of searchTerms) {
      const term = rawTerm.trim().toLowerCase();
      if (
        !(
          game.A.toLowerCase().trim().includes(term) ||
          game.B.toLowerCase().trim().includes(term) ||
          game.Turf.toLowerCase().trim().includes(term) ||
          game.Grade.toLowerCase().trim().includes(term) ||
          game.Time.toLowerCase().trim().includes(term) ||
          game.Date.toLowerCase().trim().includes(term)
        )
      )
        return false;
    }
    return true;
  });

  return (
    <>
      <Box>
        <Button sx={{ m: 1 }} onClick={() => setSortByTime(true)}>
          Sort by Time
        </Button>
        <Button sx={{ m: 1 }} onClick={() => setSortByTime(false)}>
          Sort by Grade
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxWidth: "75vw" }}>
        <Table aria-label="games table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={9}>
                <Tooltip title="Use commas for multiple search terms">
                  <TextField
                    label="Search..."
                    onChange={(event) =>
                      setSearchTerms(event.target.value.split(","))
                    }
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>A</TableCell>
              <TableCell>B</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Turf</TableCell>
              <TableCell>Umpire 1</TableCell>
              <TableCell>Umpire 2</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/*Games with info*/}
            {games.length > 0 ? (
              games
                .sort((a, b) =>
                  dateStringComparison(
                    a,
                    b,
                    sortByTime ? timeComparison : gradeComparison
                  )
                )
                .map((game) => (
                  <Game
                    key={gameToId(game)}
                    id={gameToId(game)}
                    game={game}
                    setSelectedGame={setSelectedGame}
                    updateGameValue={updateGameValue}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>None</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Games;

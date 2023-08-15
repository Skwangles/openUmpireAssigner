import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import Umpire from "./Umpire";
import { gameToId } from "./utils";
import { useState } from "react";
import TablePaginationActions from "./TablePaginationActions";

interface UmpireProps {
  umpires: any;
  highlightType: string;
  setSelectedUmpire: any;
  selectedGame: any;
}

function Umpires({ umpires, highlightType, setSelectedUmpire, selectedGame }) {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  // Disable umpires by game - by highlight mode
  if (highlightType === "game" && selectedGame["Time"]) {
    umpires = umpires.map((umpire) => {
      // Check if umpire disabled for game & attach reason
      let invalidGame = umpire.blockedGames.find(
        (game) => gameToId(game) === gameToId(selectedGame)
      );
      if (invalidGame !== undefined)
        return {
          ...umpire,
          isUnavailable: true,
          reason: invalidGame.reason || "None",
        };
      return { ...umpire, isUnavailable: false };
    });
  } else {
    umpires = umpires.map((umpire) => {
      return { ...umpire, isUnavailable: false };
    });
  }

  // Create Table rows
  let umpComponents =
    umpires.length > 0
      ? umpires
          .filter((umpire) => {
            for (const rawTerm of searchTerms) {
              const term = rawTerm.toLowerCase().trim();
              if (
                !(
                  umpire.Name.toLowerCase().trim().includes(term) ||
                  umpire.Teams.find((team) =>
                    team.toLowerCase().trim().includes(term)
                  ) ||
                  umpire.Levels.find((level) =>
                    level.toLowerCase().trim().includes(term)
                  ) ||
                  umpire.Club.toLowerCase().trim().includes(term)
                )
              )
                return false;
            }
            return true;
          })
          .sort((a, b) => a.Name.localeCompare(b.Name))
          .map((umpire) => (
            <Umpire
              key={umpire.Name}
              info={umpire}
              selectedUmpire={setSelectedUmpire}
              setSelectedUmpire={setSelectedUmpire}
            ></Umpire>
          ))
      : [];

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "75vw" }}>
      <Table>
        {/* Table headers */}
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
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
            <TableCell />
            <TableCell scope="col">Name</TableCell>
            <TableCell scope="col">Levels</TableCell>
            <TableCell scope="col">Teams</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Umpire rows*/}

          {umpComponents.length > 0 ? (
            umpComponents
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No umpires found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Umpires;

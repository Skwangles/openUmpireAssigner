import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Umpire from "./Umpire";
import { gameToId } from "./utils";

function Umpires({ umpires, highlightType, setSelectedUmpire, selectedGame }) {
  // Disable umpires by game - by highlight mode
  if (highlightType === "game" && selectedGame.hasOwnProperty("Time")) {
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
    umpires.length > 0 ? (
      umpires
        .sort((a, b) => a.Name.localeCompare(b.Name))
        .map((umpire) => (
          <Umpire
            key={umpire.Name}
            info={umpire}
            selectedUmpire={setSelectedUmpire}
            setSelectedUmpire={setSelectedUmpire}
          ></Umpire>
        ))
    ) : (
      <tr>
        <td colSpan={9}>No umpires Found</td>
      </tr>
    );

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "75vw" }}>
      <Table>
        {/* Table headers */}
        <TableHead>
          <TableRow>
            <TableCell scope="col">Name</TableCell>
            <TableCell scope="col">Levels</TableCell>
            <TableCell scope="col">Teams</TableCell>
            <TableCell scope="col">Club</TableCell>
            <TableCell scope="col">Restricted Turf</TableCell>
            <TableCell scope="col">Blockout Dates</TableCell>
            <TableCell scope="col">Limited Times</TableCell>
            <TableCell scope="col">To be aware of</TableCell>
            <TableCell scope="col">Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Umpire rows*/}
          {umpComponents}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Umpires;

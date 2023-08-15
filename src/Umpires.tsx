import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - umpComponents.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

          {(rowsPerPage > 0
            ? umpComponents.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : umpComponents
          ).map((row) => row)}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={umpComponents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default Umpires;

import { TableCell, TableRow } from "@mui/material";
import { umpireToId } from "./utils";
import { useEffect, useState } from "react";

function Game({ game, updateGameValue, setSelectedGame, id }) {
  let [ump1, setUmp1] = useState(game.ump1 || {});
  let [ump2, setUmp2] = useState(game.ump2 || {});

  // Handle case where object is changed by parent
  useEffect(() => {
    setUmp1(game.ump1);
    setUmp2(game.ump2);
  }, [game]);

  let handleClickToFocus = (event) => {
    console.log("Click!" + game.A);
    setSelectedGame(game);
  };

  //Draf and drop functionality
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  let handleDropFromDrag = (event) => {
    event.preventDefault();

    const umpire = JSON.parse(event.dataTransfer.getData("umpire"));

    // Handle 'clearing' an umpire
    if (!umpire?.hasOwnProperty("Name"))
      switch (event.target.id) {
        case "ump1name":
          setUmp1({});
          return;
        case "ump2name":
          setUmp2({});
          return;
        default:
          return;
      }

    // Check umpire is not already assigned
    if (event.target.id === "ump1name") {
      if (ump2.Name !== umpire.Name) setUmp1(umpire);
    } else if (event.target.id === "ump2name") {
      if (ump1.Name !== umpire.Name) setUmp2(umpire);
    }
  };

  // Must run after the first 'useEffect' - if game changes from parent, that should update first
  useEffect(() => {
    if (
      umpireToId(game.ump1) !== umpireToId(ump1) ||
      umpireToId(game.ump2) !== umpireToId(ump2)
    ) {
      // Update overall storage of games
      updateGameValue(id, { ...game, ump1: ump1, ump2: ump2 });
    }
  }, [ump1, ump2]);

  return (
    <TableRow
      onClick={handleClickToFocus}
      className={game.isUnavailable === true ? "table-danger" : ""}
    >
      <TableCell> {game.Date} </TableCell>
      <TableCell> {game.Grade} </TableCell>
      <TableCell> {game.A} </TableCell>
      <TableCell> {game.B} </TableCell>
      <TableCell> {game.Time} </TableCell>
      <TableCell> {game.Turf} </TableCell>
      <TableCell
        id="ump1name"
        onDrop={handleDropFromDrag}
        onDragOver={handleDragOver}
      >
        {ump1["Name"] ? ump1.Name : <b>---</b>}
      </TableCell>

      <TableCell
        id="ump2name"
        onDrop={handleDropFromDrag}
        onDragOver={handleDragOver}
      >
        {ump2["Name"] ? ump2.Name : <b>---</b>}
      </TableCell>
      {game.isUnavailable ? (
        game.reason ? (
          <TableCell>Unavailable: {game.reason}</TableCell>
        ) : (
          <TableCell>{/* Empty for notes */}</TableCell>
        )
      ) : (
        <TableCell>{/* Empty for notes */}</TableCell>
      )}
    </TableRow>
  );
}

export default Game;

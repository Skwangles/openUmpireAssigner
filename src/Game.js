import { useState } from "react";
import { umpireToId } from "./utils";
import { useEffect } from "react";

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
      updateGameValue(id, {...game, ump1:ump1, ump2:ump2});
    }
  }, [id, ump1, ump2, updateGameValue]);

  return (
    <tr
      onClick={handleClickToFocus}
      className={game.isUnavailable === true ? "table-danger" : ""}
    >
      <td> {game.Date} </td>
      <td> {game.Grade} </td>
      <td> {game.A} </td>
      <td> {game.B} </td>
      <td> {game.Time} </td>
      <td> {game.Turf} </td>
      <td id="ump1name" style={ !!ump1?.hasOwnProperty("Name") ? {} : {backgroundColor: "#F0F0F0"}} onDrop={handleDropFromDrag} onDragOver={handleDragOver}>
        {!!ump1?.hasOwnProperty("Name") ? ump1.Name : <b>---</b>}
      </td>

      <td id="ump2name" style={ !!ump2?.hasOwnProperty("Name") ? {} : {backgroundColor: "#F0F0F0"}} onDrop={handleDropFromDrag} onDragOver={handleDragOver}>
        {!!ump2?.hasOwnProperty("Name") ? ump2.Name : <b>---</b>}
      </td>
      {game.isUnavailable ? (
        game.reason ? (
          <td>Unavailable: {game.reason}</td>
        ) : (
          <td></td>
        )
      ) : (
        <td></td>
      )}
    </tr>
  );
}

export default Game;

import { useState } from "react";
import { umpireToId } from "./utils";



function Game({game, updateGameValue, setSelectedGame, id}) {
    let [ump1, setUmp1] = useState(game.ump1 || {})
    let [ump2, setUmp2] = useState(game.ump2 || {})

    let handleClickToFocus = (data, event) => {
      console.log("Click!" + game.A)
      setSelectedGame(game)
    }

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    
    let handleDropfromDrag = (event) => {
      event.preventDefault();

      const umpire = JSON.parse(event.dataTransfer.getData('umpire'));

      // Check umpire is not already assigned
      if(event.target.id === "ump1name"){
          if(ump2.name !== umpire.name)
          setUmp1(umpire)
      }
      else if (event.target.id === "ump2name"){
        if(ump1.name !== umpire.name)
          setUmp2(umpire)
      }
    }

    // Check before updating to prevent broken setState
    if(umpireToId(game.ump1) !== umpireToId(ump1) || umpireToId(game.ump2) !== umpireToId(ump2)){
      game.ump1 = ump1
      game.ump2 = ump2
      // Update overall storage of games
      updateGameValue(id, game)  
    }
 
    return (
      <tr onClick={handleClickToFocus} className={game.isDisabled === true ? "disabled" : "" } >
        <td> {game.A} </td>
        <td> {game.B} </td>
        <td> {game.Time} </td>
        <td> {game.Turf} </td>
        <td
        types={['umpire']} id="ump1name" onDrop={handleDropfromDrag} onDragOver={handleDragOver}>
            {ump1.hasOwnProperty("name") ? ump1.name : "---"}
        </td>

        <td types={['umpire']} id="ump2name" onDrop={handleDropfromDrag} onDragOver={handleDragOver}>
            {ump2.hasOwnProperty("name") ? ump2.name :  "---" }
        </td>
      </tr>
    );
  }
  
 
  
  export default Game;
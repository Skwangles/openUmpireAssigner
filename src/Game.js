import { useState } from "react";
import { Droppable } from "react-drag-and-drop";



function Game({game, updateGameValue, setSelectedGame, key}) {
    let [ump1, setUmp1] = useState({})
    let [ump2, setUmp2] = useState({})



    let handleFocus = (data, event) => {
      console.log("Click!" + game.A)
      setSelectedGame(game)
    }

    let handleDrop = (data, event) => {
      let info = JSON.parse(data.umpire)
      if(event.target.id === "ump1name"){
          setUmp1(info)
      }
      else if (event.target.id === "ump2name"){
          setUmp2(info)
      }
    }

    return (
      <tr onClick={handleFocus}>
        <td> {game.A} </td>
        <td> {game.B} </td>
        <td> {game.Time} </td>
        <td> {game.Turf} </td>
        <td>
            <Droppable types={['umpire']} id="ump1name" onDrop={handleDrop}>
            {ump1.hasOwnProperty("name" ? ump1.name : "---"}
            </Droppable>
        </td>

        <td>
            <Droppable types={['umpire']} id="ump2name" onDrop={handleDrop}>
            {ump2.hasOwnProperty("name") ? ump2.name :  "---" }
            </Droppable>
        </td>
      </tr>
    );
  }
  
 
  
  export default Game;
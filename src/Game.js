import { useState } from "react";
import { Droppable } from "react-drag-and-drop";



function Game({game, setSelectedGame}) {
    let [ump1, setUmp1] = useState({})
    let [ump2, setUmp2] = useState({})

    game.ump1 = ump1
    game.ump2 = ump2

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
            {typeof ump1.name === "undefined" ? "---" : ump1.name}
            </Droppable>
        </td>

        <td>
            <Droppable types={['umpire']} id="ump2name" onDrop={handleDrop}>
            {typeof ump2.name === "undefined" ? "---" : ump2.name}
            </Droppable>
        </td>
      </tr>
    );
  }
  
 
  
  export default Game;
import { useState } from "react";
import { Droppable } from "react-drag-and-drop";



function Game({game, updateGameValue, setSelectedGame, id}) {
    let [ump1, setUmp1] = useState({})
    let [ump2, setUmp2] = useState({})

    let handleClickToFocus = (data, event) => {
      console.log("Click!" + game.A)
      setSelectedGame(game)
    }
    
    let handleDropfromDrag = (data, event) => {
      let info = JSON.parse(data.umpire)
      if(event.target.id === "ump1name"){
          if(ump2.name !== info.name)//Check not already assiged
          setUmp1(info)
      }
      else if (event.target.id === "ump2name"){
        if(ump1.name !== info.name) //Check not already assigned
          setUmp2(info)
      }
    }

    //Handle real time updates to game
    game.ump1 = ump1
    game.ump2 = ump2
    updateGameValue(id, game)  
 
    return (
      <tr onClick={handleClickToFocus}>
        <td> {game.A} </td>
        <td> {game.B} </td>
        <td> {game.Time} </td>
        <td> {game.Turf} </td>
        <td>
            <Droppable types={['umpire']} id="ump1name" onDrop={handleDropfromDrag}>
            {ump1.hasOwnProperty("name") ? ump1.name : "---"}
            </Droppable>
        </td>

        <td>
            <Droppable types={['umpire']} id="ump2name" onDrop={handleDropfromDrag}>
            {ump2.hasOwnProperty("name") ? ump2.name :  "---" }
            </Droppable>
        </td>
      </tr>
    );
  }
  
 
  
  export default Game;
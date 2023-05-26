import { useState } from "react";



function Game({game, updateGameValue, setSelectedGame, id}) {
    let [ump1, setUmp1] = useState({})
    let [ump2, setUmp2] = useState({})

    let handleClickToFocus = (data, event) => {
      console.log("Click!" + game.A)
      setSelectedGame(game)
    }

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    
    let handleDropfromDrag = (data, event) => {
      event.preventDefault();

      const umpire = event.dataTransfer.getData('umpire');
      if(event.target.id === "ump1name"){
          if(ump2.name !== umpire.name)//Check not already assiged
          setUmp1(umpire)
      }
      else if (event.target.id === "ump2name"){
        if(ump1.name !== umpire.name) //Check not already assigned
          setUmp2(umpire)
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
        <td types={['umpire']} id="ump1name" onDrop={handleDropfromDrag} onDragOver={handleDragOver}>
            {ump1.hasOwnProperty("name") ? ump1.name : "---"}
        </td>

        <td types={['umpire']} id="ump2name" onDrop={handleDropfromDrag} onDragOver={handleDragOver}>
            {ump2.hasOwnProperty("name") ? ump2.name :  "---" }
        </td>
      </tr>
    );
  }
  
 
  
  export default Game;
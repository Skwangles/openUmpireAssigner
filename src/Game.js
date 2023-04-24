import { useState } from "react";
import { Droppable } from "react-drag-and-drop";

function Game(props) {
    let [ump1, setUmp1] = useState("---")
    let [ump2, setUmp2] = useState("---")
    return (
      <tr>
        <td> {props.a} </td>
        <td> {props.b} </td>
        <td> {props.time} </td>
        <td> {props.turf} </td>
        <td>
            <Droppable types={['umpire']} id="ump1name" onDrop={(data, event)=>handleDrop(data, event, setUmp1, setUmp2)}>
            {ump1}
            </Droppable>
        </td>

        <td>
            <Droppable types={['umpire']} id="ump2name" onDrop={(data, event)=>handleDrop(data, event, setUmp1, setUmp2)}>
            {ump2}
            </Droppable>
        </td>
      </tr>
    );
  }
  
  function handleDrop(data, event, setUmp1, setUmp2) {
    let info = JSON.parse(data.umpire)
    if(event.target.id === "ump1name"){
        setUmp1(info.name)
    }
    else if (event.target.id === "ump2name"){
        setUmp2(info.name)
    }
    console.log(event)
    // This method runs when the data drops
    console.log(data); // 'bar'

}
  
  export default Game;
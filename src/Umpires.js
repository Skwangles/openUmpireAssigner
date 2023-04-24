import { Draggable, Droppable } from 'react-drag-and-drop';
import Umpire from './Umpire';
let umpires = [{
    "name":"Alexander",
    "canMens":true,
    "canWomens": false,
    "teams":["Morrinsville"],
    "skillLevel":"R2"
},
{
    "name":"Danielle",
    "canMens":false,
    "canWomens": true,
    "teams":["Old boys"],
    "skillLevel":"R2"
}]


function Umpires() {
    let umps = umpires.map(info => <Umpire  key={info.name} info={info}></Umpire>)
  return (
    <div className="Umpires" style={{border: '1px dashed red'}}>
        {umps}
    </div>
  );
}

export default Umpires;
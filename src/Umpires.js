import { Draggable, Droppable } from 'react-drag-and-drop';
import Umpire from './Umpire';


function Umpires({umpires, highlightType, setSelectedUmpire}) {

  let umpComponents = umpires.map(info => <Umpire  key={info.name} info={info} setSelectedUmpire={setSelectedUmpire}></Umpire>)

  return (
    <div className="Umpires" style={{border: '1px dashed red'}}>
        {umpComponents}
    </div>
  );
}

export default Umpires;
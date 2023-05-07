import { Draggable, Droppable } from 'react-drag-and-drop';
import Umpire from './Umpire';
import { gameToId } from './uniqueIds';


function Umpires({umpires, highlightType, setSelectedUmpire, selectedGame}) {


  let filteredUmpires = umpires;

  if(highlightType === "game" && selectedGame.hasOwnProperty("Time")){
    console.log("Umpire filters")
    filteredUmpires = umpires.filter(umpire => umpire.games.some(game => gameToId(game) === gameToId(selectedGame)))
    console.log(filteredUmpires)
  }

  let umpComponents = filteredUmpires.map(info => <Umpire key={info.name} info={info} setSelectedUmpire={setSelectedUmpire}></Umpire>)

  return (
    <div className="Umpires">
        {umpComponents}
    </div>
  );
}

export default Umpires;
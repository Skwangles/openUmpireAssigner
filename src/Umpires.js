import { Draggable, Droppable } from 'react-drag-and-drop';
import Umpire from './Umpire';
import { gameToId } from './utils';


function Umpires({umpires, highlightType, setSelectedUmpire, selectedGame}) {


  let filteredUmpires = umpires;

  if(highlightType === "game" && selectedGame.hasOwnProperty("Time")){
    console.log("Umpire filters")
    filteredUmpires = umpires.filter(umpire => umpire.games.some(game => gameToId(game) === gameToId(selectedGame)))
    console.log(filteredUmpires)
  }

  let umpComponents = filteredUmpires.length > 0 ? filteredUmpires.map(info => <Umpire key={info.name} info={info} setSelectedUmpire={setSelectedUmpire}></Umpire>) : <td>No umpires Found</td>

  return (
    <table className=''>
      <tbody>
        {umpComponents}
        </tbody>
    </table>
  );
}

export default Umpires;
import Umpire from './Umpire';
import { gameToId } from './utils';


function Umpires({umpires, highlightType, setSelectedUmpire, selectedGame}) {


  let filteredUmpires = umpires;

  if(highlightType === "game" && selectedGame.hasOwnProperty("Time")){
    console.info("Umpires disabled")
    // Disable umpires unavailable
    filteredUmpires = umpires.map(umpire => { return {isDisabled: !umpire.games.some(game => gameToId(game) === gameToId(selectedGame)), ...umpire}})
  }

  let umpComponents = filteredUmpires.length > 0 ? filteredUmpires.map(umpire => <Umpire key={umpire.name} info={umpire} setSelectedUmpire={setSelectedUmpire}></Umpire>) : <td>No umpires Found</td>

  return (
    <table className=''>
      <tbody>
        {umpComponents}
        </tbody>
    </table>
  );
}

export default Umpires;
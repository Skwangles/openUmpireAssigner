import Umpire from './Umpire';
import { gameToId } from './utils';


function Umpires({ umpires, highlightType, setSelectedUmpire, selectedGame }) {


  // Disable umpires by game - by highlight mode
  if (highlightType === "game" && selectedGame.hasOwnProperty("Time")) {
    umpires = umpires.map(umpire => {

      // Check if umpire disabled for game & attach reason
      let invalidGame = umpire.blockedGames.find(game => gameToId(game) === gameToId(selectedGame))
      if(invalidGame !== undefined)
        return { ...umpire, isDisabled: true, reason: invalidGame.reason || "None" }
      return { ...umpire, isDisabled: false }
    })
  }


  // Create Table rows
  let umpComponents = umpires.length > 0 ? umpires.map(umpire => <Umpire key={umpire.name} info={umpire} setSelectedUmpire={setSelectedUmpire}></Umpire>) : <tr>No umpires Found</tr>


  return (
    <table className=''>

      {/* Table headers */}
      <thead>
        <th>Name</th>
        <th>M/W</th>
        <th>Skill</th>
        <th>Teams</th>
        <th>Club</th>
        <th>Notes</th>
      </thead>
      <tbody>

        {/* Umpire rows*/}
        {umpComponents}
      </tbody>
    </table>
  );
}

export default Umpires;
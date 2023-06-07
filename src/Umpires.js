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
  let umpComponents = umpires.length > 0 ? umpires.sort((a,b)=> a.Name.localeCompare(b.Name)).map(umpire => <Umpire key={umpire.Name} info={umpire} setSelectedUmpire={setSelectedUmpire}></Umpire>) : <tr>No umpires Found</tr>

// Drag and drop handling
const handleDragStartOfEmpty = (event) => {
  event.dataTransfer.setData('umpire', JSON.stringify({}));
  setSelectedUmpire({})
};

console.log("Current Umpires")
console.log(umpires)

  return (
    <table className=''>

      {/* Table headers */}
      <thead>
        <tr>
          <th>Name</th>
          <th>Levels</th>
          <th>Teams</th>
          <th>Club</th>
          <th>To be aware of</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr draggable onDragStart={(event) => handleDragStartOfEmpty(event)}>
          <td colSpan={5}><i>Drag/Drop me to clear an assignment</i></td>
        </tr>
        {/* Umpire rows*/}
        {umpComponents}
       
      </tbody>
    </table>
  );
}

export default Umpires;
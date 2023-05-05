import './App.css';
import { Draggable, Droppable } from 'react-drag-and-drop';
import {Stack} from "react-bootstrap"
import Umpires from './Umpires';
import Games from './Games';
import { useState } from 'react';
import parseUmpire from './parseUmpires';
const gameLength_min = 60

function App() {

  let [highlightType, setHighlightType] = useState("umpire")

  let [selectedGame, setSelectedGame] = useState({})
  let [selectedUmpire, setSelectedUmpire] = useState({})
  let [usedUmpires, setUsedUmpires] = useState([])


  let [games, setGames] = useState([
    {
      "A": "Morrinsville",
      "B": "Old boys",
      "Time": "16:00",
      "Turf":"GHC1",
      "Grade":"M2",
      "ump1":null,
      "ump2":null
  }, {
      "A": "Varsity",
      "B": "Old boys",
      "Time": "15:30",
      "Grade":"M3",
      "Turf":"GHC2",
      "ump1": null,
      "ump2":null
  }
  ])

  let [umpires, setUmpires] = useState([{
    "name":"Alexander",
    "canMens":true,
    "canWomens": false,
    "teams":["Morrinsville"],
    "skillLevel":"M1",
    "restrictedTurf":[]
},
{
    "name":"Danielle",
    "canMens":false,
    "canWomens": true,
    "teams":["Old boys"],
    "skillLevel":"W1",
    "restrictedTurf":[]
}, 
{
  "name":"Emilio",
  "canMens":true,
  "canWomens": true,
  "teams":[""],
  "skillLevel":"M2",
  "restrictedTurf":["St Pauls"]
}]);


  
 function convertToCsv(game){
  return game.A + "," + game.B + "," + game.Time + "," + game.Turf + "," + game.ump1?.name ?? "-" + "," + game.ump2?.name ?? "-" + "," 
 }

 let [parsedUmpires, setParsedUmpires] = useState(umpires.map(umpire => umpire["games"] = parsedUmpires(umpire, games, gameLength_min)))

  return (
    <div className="App">
      <div>
        Enter Games
      <textarea rows={4} cols={30} value={games.map(game => convertToCsv(game))}></textarea>
      </div>
      <Stack direction="horizontal" gap={2} className="col-5 mx-auto container border">
      <Games className="col-7 mx-auto" games={games} setGames={setGames} highlightType={highlightType} setSelectedGame={setSelectedGame}>
      </Games>
      <Umpires className="col-5 mx-auto" umpires={umpires} highlightType={highlightType} setSelectedUmpire={setSelectedUmpire}>
      </Umpires>
      </Stack>
    </div>
  );
}

export default App;

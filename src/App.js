import './App.css';
import { Draggable, Droppable } from 'react-drag-and-drop';
import {Button, Stack} from "react-bootstrap"
import Umpires from './Umpires';
import Games from './Games';
import { useState } from 'react';
import parseUmpire from './parseUmpires';
import { convertCsvToJson, convertJsonToCsv } from './utils';
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
    "A": "test1",
    "B": "test2",
    "Time": "11:00",
    "Turf":"GHC2",
    "Grade":"W2",
    "ump1":null,
    "ump2":null
  },
  {
  "A": "Morrinsville2",
  "B": "Old boys2",
  "Time": "9:00",
  "Turf":"GHC1",
  "Grade":"W2",
  "ump1":null,
  "ump2":null
  },
  {
  "A": "Morrinsville3",
  "B": "Old boys3",
  "Time": "10:00",
  "Turf":"GHC1",
  "Grade":"M2",
  "ump1":null,
  "ump2":null
  },{
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
  "teams":[],
  "skillLevel":"M1",
  "restrictedTurf":["St Pauls"]
  }]);
  
  
  let changeGamesJson =  (value)=>{setGames(JSON.parse(value.target.innerHTML));}
  
  let [parsedUmpires, setParsedUmpires] = useState(umpires.map(umpire => {return {...umpire, "games":parseUmpire(umpire, games, gameLength_min)}}))
  console.log("Umpires Parsed:");
  console.log(parsedUmpires)
  

  return (
    <div className="App">
      <div>
        Enter Games
      <textarea rows={4} cols={70} value={JSON.stringify(games)}></textarea>
      </div>
      <br/>
      <div className="d-flex flex-row justify-content-center">
      <Games className="" games={games} setGames={setGames} highlightType={highlightType} setSelectedGame={setSelectedGame} selectedUmpire={selectedUmpire}>
      </Games>
      <Umpires className="" umpires={parsedUmpires} highlightType={highlightType} setSelectedUmpire={setSelectedUmpire} selectedGame={selectedGame}>
      </Umpires>  
      </div> 
      <div className="row my-3 align-center">
      <Button className='col mx-2' onClick={()=>{setSelectedUmpire({}); setSelectedGame({});}}>See All</Button>
      <Button className='col mx-2' onClick={()=>{setHighlightType("umpire"); setSelectedUmpire({}); setSelectedGame({});}}>Filter by Umpire</Button>
      <Button className='col mx-2' onClick={()=>{setHighlightType("game"); setSelectedGame({}); setSelectedUmpire({});}}>Filter by Game</Button>
      </div>
      </div>
  );
}

export default App;

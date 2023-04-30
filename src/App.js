import './App.css';
import { Draggable, Droppable } from 'react-drag-and-drop';
import {Stack} from "react-bootstrap"
import Umpires from './Umpires';
import Games from './Games';
import { useState } from 'react';

function App() {
  let [selectedGame, setSelectedGame] = useState({})
  let [usedUmpires, setUsedUmpires] = useState([])


  let [games, setGames] = useState([
    {
      "A": "Morrinsville",
      "B": "Old boys",
      "Time": "16:00",
      "Turf":"GHC1"
  }, {
      "A": "Varsity",
      "B": "Old boys",
      "Time": "15:30",
      "Turf":"GHC2",
      "ump1": null,
      "ump2":null
  }
  ])
  let gameLength_min = 60
  
  return (
    <div className="App">
      <Stack direction="horizontal" gap={2} className="col-5 mx-auto container border">
      <Games className="col-7 mx-auto" setUsed={setUsedUmpires} setSelectedGame={setSelectedGame} gameLength={gameLength_min} getGames={games}>
      </Games>
      <Umpires className="col-5 mx-auto"  getUsed={usedUmpires} getSelectedGame={selectedGame} games={games} gameLength={gameLength_min}>
      </Umpires>
      </Stack>
    </div>
  );
}

export default App;

import './App.css';
import { Button, Stack } from "react-bootstrap"
import Papa from 'papaparse';
import Umpires from './Umpires';
import Games from './Games';
import { useState } from 'react';
import parseUmpire from './parseUmpires';
import { gameToId } from './utils';
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
      "Turf": "GHC1",
      "Grade": "M2",
      "ump1": null,
      "ump2": null
    }, {
      "A": "test1",
      "B": "test2",
      "Time": "11:00",
      "Turf": "GHC2",
      "Grade": "W2",
      "ump1": null,
      "ump2": null
    },
    {
      "A": "Morrinsville2",
      "B": "Old boys2",
      "Time": "9:00",
      "Turf": "GHC1",
      "Grade": "W2",
      "ump1": null,
      "ump2": null
    },
    {
      "A": "Morrinsville3",
      "B": "Old boys3",
      "Time": "10:00",
      "Turf": "GHC1",
      "Grade": "M2",
      "ump1": null,
      "ump2": null
    }, {
      "A": "Varsity",
      "B": "Old boys",
      "Time": "15:30",
      "Grade": "M3",
      "Turf": "GHC2",
      "ump1": null,
      "ump2": null
    }
  ])

  let [umpires, setUmpires] = useState([{
    "name": "Alexander",
    "canMens": true,
    "canWomens": false,
    "teams": ["Morrinsville"],
    "skillLevel": "M1",
    "restrictedTurf": []
  },
  {
    "name": "Jamie",
    "canMens": false,
    "canWomens": true,
    "teams": ["Old boys"],
    "skillLevel": "W1",
    "restrictedTurf": []
  },
  {
    "name": "Rhys",
    "canMens": true,
    "canWomens": true,
    "teams": [],
    "skillLevel": "M1",
    "restrictedTurf": ["St Pauls"]
  }]);

  const [teamData, setTeamData] = useState([]);

  const handleTeamsUpload = (event) => {
    const file = event.target.files[0];

    // Parse contents
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setTeamData(results.data);
      },
    });
  };

  const handleGamesUpload = (event) => {
    const file = event.target.files[0];

    // Parse contents
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let games = []
        for (const game of results.data){
         
          // Categorise game grade by teams list
          const team = teamData.find(team => team.Name == game.A || team.Name == game.B);
          if(team == undefined || !team.hasOwnProperty("Grade")){
            console.log("Invalid teams in game, or team object malformed: " + JSON.stringify(game))
            continue;
          }

          //Add extra entries to game info
          games.push({...game, "Grade": team.Grade, ump1: null, ump2: null})
        }

        setGames(games);
      },
    });
  };
  
  let [parsedUmpires, setParsedUmpires] = useState(umpires.map(umpire => { return { ...umpire, "blockedGames": parseUmpire(umpire, games, gameLength_min) } }))
  
  return (
    <div className="App">

      {/* Upload of games CSV*/}
      <div>
        Enter Games:
        <input type="file" accept=".csv" onChange={handleTeamsUpload} />
      </div>

      <div>
        Enter Team Names:
        <input type="file" accept=".csv" onChange={handleTeamsUpload} />
      </div>

      <h4>Disabling for: {highlightType === "game" ? (selectedGame.hasOwnProperty("A") ? gameToId(selectedGame) : "None selected") : selectedUmpire.hasOwnProperty("name") ? selectedUmpire.name : "None Selected"}</h4>
      {/* Print games */}
      <h1>Games</h1>
      <div className="d-flex flex-row justify-content-center ">
        <Games className="" games={games} setGames={setGames} highlightType={highlightType} setSelectedGame={setSelectedGame} selectedUmpire={selectedUmpire}>
        </Games>
      </div>

      {/* Umpires list and information */}
      <h1>Umpires</h1>
      <div className="py-3 d-flex flex-row justify-content-center ">
        <Umpires className="" umpires={parsedUmpires} highlightType={highlightType} setSelectedUmpire={setSelectedUmpire} selectedGame={selectedGame}>
        </Umpires>
      </div>

      {/* Highlight modes */}
      <div className="row my-3 align-center">
        <Button className='col mx-2 ' onClick={() => { setSelectedUmpire({}); setSelectedGame({}); }}>Clear Gray</Button>
        <Button className='col mx-2' onClick={() => { setHighlightType("umpire"); setSelectedUmpire({}); setSelectedGame({}); }}>Filter by Umpire</Button>
        <Button className='col mx-2' onClick={() => { setHighlightType("game"); setSelectedGame({}); setSelectedUmpire({}); }}>Filter by Game</Button>
      </div>
    </div>
  );
}

export default App;

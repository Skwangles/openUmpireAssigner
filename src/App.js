import './App.css';
import { Button } from "react-bootstrap"
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

  // CSV files are added which modify these
  let [games, setGames] = useState([])
  let [umpires, setUmpires] = useState([]);

  const [teamData, setTeamData] = useState([]);

  const handleTeamsUpload = (event) => {
    const file = event.target.files[0];

    // Parse contents
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.info("Team data set!")
        console.info(results.data)
        setTeamData(results.data);
      },
    });
  };

const stripToTurf = (name) => {
  switch(name){
    case "New World Te Rapa Turf 1":
      return "Turf 1"
    case "Lugtons Turf 2":
      return "Turf 2"
    case "St Pauls Collegiate":
      return "St Pauls"
    default:
      return name
  }
}

const csvToGame = (game) => {
  return {
    "A": game["home team"],
    "B": game["away team"],
    "Time": game["game time"],
    "Turf": stripToTurf(game["playing surface"]),
    "Date": game["game date"],
    "Round": game["round"],
    "Grade": game["grade"].substring(0, 3).replace("R", ""), //e.g. MR3 Name1 Name2 -> M3
    ump1: null, 
    ump2: null
  }
}

const csvToUmpire = (umpire) => {
  //Idk why I haven't capitalised the values - just roll with it
  return {
    "Name": umpire["Name"],
    "Teams": umpire["Teams"].split(",\\s+"),
    "Levels": umpire["Levels"].split(",\\s+"),
    "RestrictedTurf": umpire["Restricted Turfs"].split(",\\s+")
  }
}

const handleUmpiresUpload = (event) => {
  const file = event.target.files[0];

  // Parse contents
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      let umpireList = []
      for (const umpire of results.data){
        umpireList.push(csvToUmpire(umpire))
      }

      setUmpires(umpireList);
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
        let gameList = []
        for (const game of results.data){
          //Add extra entries to game info
          
          if (game["bye"] !== "") continue; //Bye row

          gameList.push(csvToGame(game))
        }

        setGames(gameList);
      },
    });
  };

  const addWomensGames = (event) => {
    const file = event.target.files[0];

    // Parse contents
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.info("Parsing games")
        console.info(results.data)
        let gameList = []
        for (const game of results.data){
          //Add extra entries to game info
          
          if (game["bye"] !== "") continue; //Bye row

          gameList.push(csvToGame(game))
        }

        setGames(games.concat(gameList));
      },
    });
  }
  
 
  
  let parsedUmpires = umpires.map(umpire => { return { ...umpire, "blockedGames": parseUmpire(umpire, games, gameLength_min) } });

  return (
    <div className="App">
      <div>
        (MUST LOAD BEFORE GAMES!!) 
        <br/>
        Enter Available Teams:
        <br/>
        <input type="file" accept=".csv" onChange={handleTeamsUpload} />
      </div>

      <div>
        Enter Games:<br/>
        <input type="file" accept=".csv" onChange={handleGamesUpload} />
      </div>
      <div>
        (Optional) Extra Games CSV:<br/>
        <input type="file" accept=".csv" onChange={addWomensGames} />
      </div>

     

      <h4>Disabling for: {highlightType === "game" ? (selectedGame.hasOwnProperty("A") ? gameToId(selectedGame) : "None selected") : selectedUmpire.hasOwnProperty("Name") ? selectedUmpire.Name : "None Selected"}</h4>
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

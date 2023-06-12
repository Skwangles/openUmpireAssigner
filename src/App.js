import './App.css';
import { Button } from "react-bootstrap"
import Papa from 'papaparse';
import Umpires from './Umpires';
import Games from './Games';
import { useState } from 'react';
import parseUmpire from './parseUmpires';
import { gameToId, csvToGame, csvToUmpire } from './utils';
const gameLength_min = 60


function loadLocalFile(fileName, callback) {
  const filePath = process.env.PUBLIC_URL + '/' + fileName; // Construct the file path

  return fetch(filePath)
    .then(response => response.text())
    .then(fileContent => {
      const event = {
        target: {
            files: [fileContent]
        }
      };

      callback(event); // Pass the event to the callback function
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


function App() {
  let [highlightType, setHighlightType] = useState("umpire")
  let [selectedGame, setSelectedGame] = useState({})
  let [selectedUmpire, setSelectedUmpire] = useState({})

  // CSV files are added which modify these
  let [games, setGames] = useState(JSON.parse(localStorage.getItem("games") || '[]'))
  let [umpires, setUmpires] = useState(JSON.parse(localStorage.getItem("umpires") || '[]'));


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
  
 localStorage.setItem("games", JSON.stringify(games));
 localStorage.setItem("umpires", JSON.stringify(umpires));
  
  let parsedUmpires = umpires.map(umpire => { return { ...umpire, "blockedGames": parseUmpire(umpire, games, gameLength_min) } });

  let loadExamples = () =>
  {
   loadLocalFile('example-games.csv', handleGamesUpload)
   loadLocalFile('example-umpires.csv', handleUmpiresUpload)
  }

  return (
    <div className="App">
    <div className='container'>
      <h2>How to use:</h2><br/>
      - This is a drag and drop system, you drag and drop the desired umpire into an ump1 or ump2 column to 'assign' them.<br/>
      - Click on an umpire to see which games they are 'unavailable' for - or alternatively, click 'filter by game' to see umpires who are available for a specific game.<br/>
      - Load the games in with the following file inputs (or click 'Load demo data' to play around).<br/>
      - When you load data, any changes/data loaded should be saved if you reload the page. <br/>
      - If you need to 'undo' an 'assignment', just drag and drop the special row at the top of the 'umpires' section and drop it where you want to 'undo'<br/>
    </div>
    <br/>
      <div>
        Enter Umpires:
        <br/>
        <input type="file" accept=".csv" onChange={handleUmpiresUpload} />
      </div>

      <div>
        Enter Games:<br/>
        <input type="file" accept=".csv" onChange={handleGamesUpload} />
      </div>
      <div>
        (Optional) Extra Games CSV:<br/>
        <input type="file" accept=".csv" onChange={addWomensGames} />
      </div>
      <div className='py-2'>
        <Button className=" btn-sm btn-secondary" onClick={loadExamples}>Load Demo Data</Button>
      </div>
     

      
      {/* Print games */}
      <h1>Games</h1>
      <div className="d-flex flex-row justify-content-center ">
        <Games className="" games={games} setGames={setGames} highlightType={highlightType} setSelectedGame={setSelectedGame} selectedUmpire={selectedUmpire}>
        </Games>
      </div>
      <br/>
      <h4>Checking availability for: {highlightType === "game" ? (selectedGame.hasOwnProperty("A") ? selectedGame.Date + '@' + selectedGame.Time + " - " + selectedGame.A + ' vs ' + selectedGame.B : "-") : selectedUmpire.hasOwnProperty("Name") ? selectedUmpire.Name : "-"}</h4>
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

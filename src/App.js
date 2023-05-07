import './App.css';
import { Draggable, Droppable } from 'react-drag-and-drop';
import {Button, Stack} from "react-bootstrap"
import Umpires from './Umpires';
import Games from './Games';
import { useState } from 'react';
import parseUmpire from './parseUmpires';
const gameLength_min = 60

function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step 
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}
  
function convertToCsv(game){
  return game.A + "," + game.B + "," + game.Time + "," + game.Turf + "," + game.ump1?.name ?? "-" + "," + game.ump2?.name ?? "-" + "," 
 }


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




 let [parsedUmpires, setParsedUmpires] = useState(umpires.map(umpire => {return {...umpire, "games":parseUmpire(umpire, games, gameLength_min)}}))
 console.log(parsedUmpires)
  return (
    <div className="App">
      <div>
        Enter Games
      <textarea rows={4} cols={30} value={games.map(game => convertToCsv(game))} onChange={(value)=>{setGames(csvJSON(value))}}></textarea>
      </div>
      <br/>
      <Stack direction="horizontal" gap={2} className="col-5 mx-auto container">
        
      <Games className="col-7 mx-auto" games={games} setGames={setGames} highlightType={highlightType} setSelectedGame={setSelectedGame} selectedUmpire={selectedUmpire}>
      </Games>
      <Umpires className="col-5 mx-auto" umpires={parsedUmpires} highlightType={highlightType} setSelectedUmpire={setSelectedUmpire} selectedGame={selectedGame}>
      </Umpires>
      <Button onClick={()=>{setSelectedUmpire({}); setSelectedGame({});}}>See All</Button>
      
      </Stack>    
      <Stack direction="horizontal" gap={2} className="col-5 mx-auto container">
      <Button onClick={()=>{setHighlightType("umpire"); setSelectedUmpire({}); setSelectedGame({});}}>Filter by Umpire</Button>
      <Button onClick={()=>{setHighlightType("game"); setSelectedGame({}); setSelectedUmpire({});}}>Filter by Game</Button>
      </Stack>
    </div>
  );
}

export default App;

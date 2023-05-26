import Game from './Game';
import {gameToId} from './utils.js'
import "./Games.css"

function updateUsedUmpires(games, setUsedUmpires){
    // Keep track of umpires
    let usedUmpires = {}
    games.forEach(game => {
        if(game.ump1 != null)
            usedUmpires[game.ump1.name] > 0 ? usedUmpires[game.ump1.name] += 1 : usedUmpires[game.ump1.name] = 1
        if(game.ump2 != null)
            usedUmpires[game.ump2.name] > 0 ? usedUmpires[game.ump2.name] += 1 : usedUmpires[game.ump2.name] = 1   
    });
    setUsedUmpires(usedUmpires)
} 


function Games({games, highlightType, setGames, setSelectedGame, selectedUmpire}) {


    
    let updateGameValue = (key, newGame) => {
        let indexOfGame = -1;
        for(const index in games)
        {
            let item = games[index]
            if(item.Time + "|" + item.Turf === key)
            {
                indexOfGame = index
                break;
            }
        }
        if(indexOfGame < 0) return false
        games[indexOfGame] = newGame
        setGames(games)
    }
    
    let filteredGames = games;
    if(highlightType === "umpire" && selectedUmpire.hasOwnProperty("name")){
        console.log("Filtering out games")
        filteredGames = selectedUmpire.games
    }

  return (
        <table>
            <thead>
            <tr>  
            <th>A</th>
            <th>B</th>
            <th>Time</th>
            <th>Turf</th>
            <th>Umpire 1</th>
            <th>Umpire 2</th>
            </tr>
            </thead>
            <tbody>
            
                {filteredGames.length > 0 ? filteredGames.map(info => <Game key={gameToId(info)} id={gameToId(info)} game={info} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game> ): <tr><td colSpan={6}>None</td></tr>}
                </tbody>
        </table>
  );
}

export default Games;
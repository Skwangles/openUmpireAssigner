import { Draggable, Droppable } from 'react-drag-and-drop';
import Game from './Game';
import {gameToId} from './uniqueIds.js'
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
    <div className="Games">
        <table>
            <tbody>
                {filteredGames.map(info => <Game key={gameToId(info)} id={gameToId(info)} game={info} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game> )}
                </tbody>
        </table>
    </div>
  );
}

export default Games;
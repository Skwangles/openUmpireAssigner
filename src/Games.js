import { Draggable, Droppable } from 'react-drag-and-drop';
import Game from './Game';
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


function Games({games, highlightType, setGames}) {

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

  return (
    <div className="Games" style={{border: '1px dashed red'}}>
        <table>
            <tbody>
                {games.map(info => <Game key={info.Time + "|" + info.Turf} game={info} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game> )}
                <Game game={{"A":"--", "B":"--", "Time":"00:00"}} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game>
            </tbody>
        </table>
    </div>
  );
}

export default Games;
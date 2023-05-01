import { Draggable, Droppable } from 'react-drag-and-drop';
import Game from './Game';
import "./Games.css"

 

function Games({getGames, setGames, setUsedUmpires, gameLength, setSelectedGame}) {

    let updateGameValue = (key, newGame) => {
        let indexOfGame = -1;
        for(const index in getGames)
        {
            let item = getGames[index]
            if(item.Time + "|" + item.Turf === key)
            {
                indexOfGame = index
                break;
            }
        }
        if(indexOfGame < 0) return false
        getGames[indexOfGame] = newGame
        setGames(getGames)
    }


  return (
    <div className="Games" style={{border: '1px dashed red'}}>
        <table>
            <tbody>
                {getGames.map(info => <Game key={info.Time + "|" + info.Turf} game={info} setSelectedGame={setSelectedGame}></Game> )}
                <Game game={{"A":"--", "B":"--", "Time":"00:00"}} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game>
            </tbody>
        </table>
    </div>
  );
}

export default Games;
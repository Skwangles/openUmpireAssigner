import { Draggable, Droppable } from 'react-drag-and-drop';
import Game from './Game';
import "./Games.css"

 

function Games({getGames, setGames, setUsedUmpires, gameLength, setSelectedGame}) {
  return (
    <div className="Games" style={{border: '1px dashed red'}}>
        <table>
            <tbody>
                {getGames.map(info => <Game key={info.A + info.B} game={info} setSelectedGame={setSelectedGame}></Game> )}
                <Game game={{"A":"--", "B":"--", "Time":"00:00"}} setSelectedGame={setSelectedGame}></Game>
            </tbody>
        </table>
    </div>
  );
}

export default Games;
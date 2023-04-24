import { Draggable, Droppable } from 'react-drag-and-drop';
import Game from './Game';
import "./Games.css"
let games = [{
    "A": "Morrinsville",
    "B": "Old boys",
    "Time": "3:30",
    "Turf":"GHC1"
}, {
    "A": "Varsity",
    "B": "Old boys",
    "Time": "4:00",
    "Turf":"GHC2",
    "ump1": null,
    "ump2":null
}]

let isCrossover = (ownTeams, ) => {
    ownTeams.forEach(element => {
        return false
    });
}


function Games() {
    let gameComp = games.map(info => <Game key={info.A + info.B} a={info.A} b={info.B} time={info.Time} turf={info.Turf}></Game>)
  return (
    <div className="Games" style={{border: '1px dashed red'}}>
        <table>
            <tbody>
        {gameComp}
        </tbody>
        </table>
    </div>
  );
}

export default Games;
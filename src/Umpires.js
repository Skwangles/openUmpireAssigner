import { Draggable, Droppable } from 'react-drag-and-drop';
import Umpire from './Umpire';
let umpires = [{
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
  "teams":[""],
  "skillLevel":"M2",
  "restrictedTurf":["St Pauls"]
}]

/**
 * Get 'avoid' times based on the 'teams' an umpire is set to work with
 * @param {Team names to avoid games with} umpTeams 
 * @param {Array of all games} games 
 * @returns 
 */
let getTimes = (umpTeams, games) => {
  let avoidTimes = []
  games.forEach(game => {
      if(umpTeams.includes(game.A) || umpTeams.includes(game.B)){
          let time = game.Time.split(':')
          let startTime = {"hour":parseInt(time[0]), "min":parseInt(time[1])}
          avoidTimes.push({"start":startTime, "end": getEndTime(startTime, 60)})
      }
  })
  return avoidTimes
}

/**
 * Based on an object with hour and min value, calculate the new valid
 * @param {*} time 
 * @param {*} gameLength 
 * @returns 
 */
function getEndTime(time, gameLength){
  const minsInHour = 60;
  let newMin = time.min + gameLength
  let newHour = time.hour
  if (newMin >= minsInHour ) {
    newHour += Math.floor(newMin / minsInHour);
  }
  return {"hour":newHour, "min":Math.floor(newMin % minsInHour)};
}

/**
 * time1 <= time2 - DOES NOT HANDLE MIDNIGHT EDGE CASE
 * @param {hour & min obj} time1 
 * @param {house & min obj} time2 
 * @returns if time1 < time2
 */
function timeLessThanEqual(time1, time2){
  if(time1.hour < time2.hour){
    return true
  }
  else if (time1.hour === time2.hour){
    return time1.min <= time2.min
  }
  return false
}

let isTimewiseAvailable = (umpire, selectedGame, games, gameLength) => {
  console.log("Checking cross over")
  //Handle no specified 'selectedGame'
  if(typeof selectedGame.Time === "undefined") return true;

  //Calc areas Umpire can't play in
  let avoidTimes = getTimes(umpire.teams, games);

  //Parse game time
  let time = selectedGame.Time.split(':');
  let gameStart = {"hour": parseInt(time[0]), "min":parseInt(time[1])}
  let gameEnd = getEndTime(gameStart, gameLength)

  for (const avoid of avoidTimes) {
    //Check if any edges overlap
      if ((timeLessThanEqual(gameStart, avoid.end) && timeLessThanEqual(avoid.start, gameEnd)) || (timeLessThanEqual(avoid.start, gameEnd) && timeLessThanEqual(gameStart, avoid.end))) {
          //Overlap
          return false;
      }
  }
  return true;
}

const levels = {
  "W1": 0,
  "W2": 1,//Approx same as Mens 3
  "M3": 1,
  "M2": 2,
  "M1": 3,
  "Prem": 4
}


let fitsUmpirePreferences = (umpire, getSelectedGame) => {

  //Check if wants to do this level
  if(canWomens == false && getSelectedGame.Grade.includes("W")) return false
  if(canMens == false && getSelectedGame.Grade.includes("M")) return false

  //Check if can attend venue
  if(getSelectedGame.Turf in umpire.restrictedTurf) return false

  //Skill level check
  if(levels[umpire.skillLevel] < levels[getSelectedGame.Grade]) return false
}


let alreadyPicked = (umpire, usedUmpires) => {
  if(usedUmpires[umpire.name] > 0) return true
}

function Umpires({getUsed/*Disable if already selected*/, getSelectedGame, games, gameLength, highlightType}) {

  availableUmps = umpires
  
  //Mode will eliminate unavailable umpires
  if(highlightType == "game" && (getSelectedGame != null && getSelectedGame !== {})){
    availableUmps = umpires.filter(ump => !alreadyPicked(ump, getUsed) && fitsUmpirePreferences(ump, getSelectedGame) && !isTimewiseAvailable(ump, getSelectedGame, games, gameLength) )
  }

  let umpComponents = availableUmps.map(info => <Umpire  key={info.name} info={info}></Umpire>)

  console.log(availableUmps)
  return (
    <div className="Umpires" style={{border: '1px dashed red'}}>
        {umpComponents}
    </div>
  );
}

export default Umpires;
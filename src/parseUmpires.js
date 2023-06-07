// Time after game start to 'avoid' 
const GAME_LENGTH = 78;
const MINS_IN_HOUR = 60;


/**
 * Get 'avoid' times based on the 'teams' an umpire is set to work with
 * @param {Team names to avoid games with} umpTeams 
 * @param {Array of all games} games 
 * @returns 
 */
let getTimes = (umpTeams, games) => {
  let avoidTimes = []
  games.forEach(game => {
    if (umpTeams.includes(game.A) || umpTeams.includes(game.B)) {
      let time = game.Time.split(':')
      let startTime = { "hour": parseInt(time[0]), "min": parseInt(time[1]) }
      avoidTimes.push({"date": game.Date, "start": startTime, "end": getEndTime(startTime, GAME_LENGTH) })
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
function getEndTime(time, gameLength) {
  let newMin = time.min + gameLength
  let newHour = time.hour
  if (newMin >= MINS_IN_HOUR) {
    newHour += Math.floor(newMin / MINS_IN_HOUR);
  }
  return { "hour": newHour, "min": Math.floor(newMin % MINS_IN_HOUR) };
}

/**
 * time1 <= time2 - DOES NOT HANDLE MIDNIGHT EDGE CASE
 * @param {hour & min obj} time1 
 * @param {house & min obj} time2 
 * @returns if time1 < time2
 */
function timeLessThanEqual(time1, time2) {
  if (time1.hour < time2.hour) {
    return true
  }
  else if (time1.hour === time2.hour) {
    return time1.min <= time2.min
  }
  return false
}

let timeToString = (time) => time.hour + ":" + time.min



let isTimewiseUnavailable = (umpire, checkedGame, games, gameLength) => {
  //Handle no specified 'selectedGame'
  if (typeof checkedGame.Time === "undefined") return true;

  //Calc areas Umpire can't play in
  let avoidTimes = getTimes(umpire.Teams, games);

  //Parse game time
  let time = checkedGame.Time.split(':');
  let gameStart = { "hour": parseInt(time[0]), "min": parseInt(time[1]) }
  let gameEnd = getEndTime(gameStart, gameLength)

  for (const avoid of avoidTimes) {
    if(avoid.Date != checkedGame.Date) continue;
    //Check if any edges overlap
    if ((timeLessThanEqual(gameStart, avoid.end) && timeLessThanEqual(avoid.start, gameEnd)) || (timeLessThanEqual(avoid.start, gameEnd) && timeLessThanEqual(gameStart, avoid.end))) {
      //Overlap
      return "Cannot do: " + timeToString(avoid.start) + "-" + timeToString(avoid.end) + " on the: " + avoid.Date;
    }
  }
  return false;
}

/**
 * Get the team the umpire is playing for, or false if neither
 * @param {*} umpire 
 * @param {*} checkedGame 
 * @returns 
 */
let isPlaying = (umpire, checkedGame) => {
  if (umpire.Teams.includes(checkedGame.A))
    return checkedGame.A
  if (umpire.Teams.includes(checkedGame.B))
    return checkedGame.B

  return false
}

let failsUmpirePreferences = (umpire, checkedGame) => {

  //Check if can attend venue
  if (checkedGame.Turf in umpire.RestrictedTurf) return "Doesn't do turf " + checkedGame.Turf

  return false
}

let failsUmpireAbilities = (umpire, checkedGame) => {
  //Check if wants/can to do this level
  if (!umpire.Levels.includes(checkedGame.Grade) && !(umpire.Levels.includes("All") || umpire.Levels.includes("all"))){
    return "Not within specified levels: " +  (umpire.Levels.length > 0 ? umpire.Levels.join(", ") : "No Levels specified!");
  }

  return false;
}


function parseUmpire(umpire, games, gameLength) {

  let unavailableGames = []

  games.forEach(game => {
    // Check if 1. Is already playing > Can make it timewise > Has the right abilities > Would even want to play (i.e. if desperate, abilties and wants are less important) 

    let playingFor = isPlaying(umpire, game)
    if (playingFor) {
      unavailableGames.push({ reason: "Playing for: " + playingFor, ...game })
      return // Only let one reason be fore each game
    }

    let timewiseIssue = isTimewiseUnavailable(umpire, game, games, gameLength)
    if (timewiseIssue){
      unavailableGames.push({ reason: "Time: " + timewiseIssue, ...game })
      return
    }

    let abilitiesIssue = failsUmpireAbilities(umpire, game)
    if (abilitiesIssue){
      unavailableGames.push({ reason: "Abilities: " + abilitiesIssue, ...game })
      return
    }

    // Check umpire WANTS to do it
    let preferenceClash = failsUmpirePreferences(umpire, game)
    if (preferenceClash) {
      unavailableGames.push({ reason: "Preference: " + preferenceClash, ...game })
      return
    }
  })

  return unavailableGames
}


export default parseUmpire
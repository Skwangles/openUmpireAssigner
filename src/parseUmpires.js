const levels = {
    "W2": 0,
    "W1": 1,//Approx same as Mens 3
    "M3": 1,
    "M2": 2,
    "M1": 3,
    "Prem": 4
  }
  





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
  
  let timeToString = (time) => time.hour + ":" + time.min



  let isTimewiseUnavailable = (umpire, checkedGame, games, gameLength) => {
    console.log("Checking cross over")
    //Handle no specified 'selectedGame'
    if(typeof checkedGame.Time === "undefined") return true;
  
    //Calc areas Umpire can't play in
    let avoidTimes = getTimes(umpire.teams, games);
  
    //Parse game time
    let time = checkedGame.Time.split(':');
    let gameStart = {"hour": parseInt(time[0]), "min":parseInt(time[1])}
    let gameEnd = getEndTime(gameStart, gameLength)
  
    for (const avoid of avoidTimes) {
      //Check if any edges overlap
        if ((timeLessThanEqual(gameStart, avoid.end) && timeLessThanEqual(avoid.start, gameEnd)) || (timeLessThanEqual(avoid.start, gameEnd) && timeLessThanEqual(gameStart, avoid.end))) {
            //Overlap
            return "Cannot do: " + timeToString(avoid.start) + "-" + timeToString(avoid.end)
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
  let isPlaying =  (umpire, checkedGame) => {
    if (umpire.teams.includes(checkedGame.A))
      return checkedGame.A
    if (umpire.teams.includes(checkedGame.B))
      return checkedGame.B

    return false
  }

  let failsUmpirePreferences = (umpire, checkedGame) => {
  
    //Check if wants to do this level
    if(umpire.canWomens === false && checkedGame.Grade.includes("W")) return "Doesn't do womens"
    if(umpire.canMens === false && checkedGame.Grade.includes("M")) return "Doesn't do mens"
  
    //Check if can attend venue
    if(checkedGame.Turf in umpire.restrictedTurf) return "Doesn't do turf " + checkedGame.Turf 
  
    return false
  }

  let failsUmpireAbilities = (umpire, checkedGame) => {
   //Skill level check
   return levels[umpire.skillLevel] < levels[checkedGame.Grade] ? "Only umpires " + umpire.skillLevel + " and under" : false 
  }
  
  
  let alreadyPicked = (umpire, usedUmpires) => {
    if(usedUmpires[umpire.name] > 0) return true
  }


function parseUmpire(umpire, games, gameLength){
  console.log("Games...")
  console.log(games)
  let unavailableGames = []
  games.forEach(game => {
    let playingFor = isPlaying(umpire, game)
    if (playingFor)
      unavailableGames.push({reason: "Playing for: " + playingFor, ...game})

    // Check umpire WANTS to do it
    let preferenceClash = failsUmpirePreferences(umpire, game)
    if(preferenceClash)
        unavailableGames.push({reason: "Preference: " + preferenceClash, ...game})

    let abilitiesIssue = failsUmpireAbilities(umpire, game)
    if(abilitiesIssue)
        unavailableGames.push({reason: "Abilities: " + abilitiesIssue, ...game})
    
    let timewiseIssue = isTimewiseUnavailable(umpire, game, games, gameLength)
    if (timewiseIssue)
        unavailableGames.push({reason: "Time: " + timewiseIssue, ...game})
  })

  return unavailableGames
}


  export default parseUmpire
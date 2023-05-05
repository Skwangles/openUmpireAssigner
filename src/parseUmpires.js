const levels = {
    "W1": 0,
    "W2": 1,//Approx same as Mens 3
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
  




  let isTimewiseAvailable = (umpire, checkedGame, games, gameLength) => {
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
            return false;
        }
    }
    return true;
  }

  let fitsUmpirePreferences = (umpire, checkedGame) => {
  
    //Check if wants to do this level
    if(umpire.canWomens == false && checkedGame.Grade.includes("W")) return false
    if(umpire.canMens == false && checkedGame.Grade.includes("M")) return false
  
    //Check if can attend venue
    if(checkedGame.Turf in umpire.restrictedTurf) return false
  
    //Skill level check
    if(levels[umpire.skillLevel] < levels[checkedGame.Grade]) return false
  }
  
  
  let alreadyPicked = (umpire, usedUmpires) => {
    if(usedUmpires[umpire.name] > 0) return true
  }


function parseUmpire(umpire, games, gameLength){
    return games.filter(game => /*!alreadyPicked(umpire, getUsed) &&*/ fitsUmpirePreferences(umpire, game) && !isTimewiseAvailable(umpire, game, games, gameLength))
}


  export default parseUmpire
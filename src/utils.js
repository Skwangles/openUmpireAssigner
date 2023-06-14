function gameToId(info) {
    if (!info || !info.hasOwnProperty("Time")) return null

    return info.Date + "|" + info.Time + "|" + info.Turf
}

function umpireToId(info) {
    if (!info || !info.hasOwnProperty("Name")) return null

    return info.Name + "|" + info.Levels.join(",")
}

const csvToGame = (game) => {
    return {
      "A": game["home team"],
      "B": game["away team"],
      "Time": game["game time"],
      "Turf": stripToTurf(game["playing surface"]),
      "Date": game["game date"],
      "Round": game["round"],
      "Grade": game["grade"].substring(0, 3).replace("R", ""), //e.g. MR3 Name1 Name2 -> M3
      ump1: null, 
      ump2: null
    }
  }
  
  const csvToUmpire = (umpire) => {
    return {
      "Name": umpire["Name"],
      "Teams": umpire["Teams"].split(/,\s+/) || [],
      "Levels": umpire["Levels"].split(/,\s+/) || [],
      "RestrictedTurf": umpire["Restricted Turfs"].split(/,\s+/) || [],
      "Club": umpire["Club"] || "",
      "TBAO": umpire["To be aware of"] || "",
      "Notes":umpire["Notes"] || ""
    }
  }

  const stripToTurf = (name) => {
    switch(name){
      case "New World Te Rapa Turf 1":
        return "Turf 1"
      case "Lugtons Turf 2":
        return "Turf 2"
      case "St Pauls Collegiate":
        return "St Pauls"
      default:
        return name
    }
  }


  function dateStringComparison(a, b){
    // -ve a < b, +ve a > b
    
    if (a.Date === b.Date) 
      {
        if (a.Time === b.Time)
          return 0
           
        // Checking time (they aren't equal)
        let timeHourA = a.Time.split(":")
        let timeHourB = b.Time.split(":")

        if (timeHourA[0] !== timeHourB[0])
          return Number(timeHourA[0]) < Number(timeHourB[0]) ? -1 : 1
        
        if (timeHourA[1] !== timeHourB[1])
          return Number(timeHourA[1]) < Number(timeHourB[1]) ? -1 : 1  

      }
    
    // Checking Date (they aren't equal)  
    let partsA = a.Date.split("/")
    let partsB = b.Date.split("/")

    if (partsA[2] !== partsB[2])
      return Number(partsA[2]) < Number(partsB[2]) ? -1 : 1 //Smaller year, comes higher
      
    if (partsA[1] !== partsB[1])
      return Number(partsA[1]) < Number(partsB[1]) ? -1 : 1

    return Number(partsA[0]) < Number(partsB[0]) ? -1 : 1
  }

export { gameToId, umpireToId, csvToGame, csvToUmpire, dateStringComparison }
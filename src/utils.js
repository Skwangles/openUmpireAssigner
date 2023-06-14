function gameToId(info) {
    if (!info || !info.hasOwnProperty("Time")) return null

    return info.Date + "|" + info.Time + "|" + formatString(info.Turf)
}

function umpireToId(info) {
    if (!info || !info.hasOwnProperty("Name")) return null

    return formatString(info.Name) + "|" + formatString(info.Levels.join(","))
}

const csvToGame = (game) => {
    return {
      "A": game["home team"].trim(),
      "B": game["away team"].trim(),
      "Time": game["game time"].trim(),
      "Turf": stripToTurf(game["playing surface"]).trim(),
      "Date": game["game date"].trim(),
      "Round": game["round"].trim(),
      "Grade": game["grade"].trim().substring(0, 3).replace("R", ""), //e.g. MR3 Name1 Name2 -> M3
      ump1: null, 
      ump2: null
    }
  }
  
  const csvToUmpire = (umpire) => {
    return {
      "Name": umpire["Name"].trim(),
      "Teams": umpire["Teams"].split(/\s+,\s+/) || [],
      "Levels": umpire["Levels"].split(/\s+,\s+/) || [],
      "RestrictedTurf": umpire["Restricted Turfs"].split(/\s+,\s+/) || [],
      "Club": umpire["Club"].trim() || "",
      "TBAO": umpire["To be aware of"].trim() || "",
      "Notes":umpire["Notes"].trim() || ""
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

  function timeComparison(a, b){
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

  function gradeComparison(a, b){
    return a.Grade.localeCompare(b.Grade)
  }

  function dateStringComparison(a, b, subpredicate){
    // -1 means it is higher (e.g. A of A-Z)
    
    if (a.Date === b.Date) 
      {
       return subpredicate(a, b)
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


  function formatString(string){
    return string.toLowerCase().trim()
  }


export { gameToId, umpireToId, csvToGame, csvToUmpire, dateStringComparison, timeComparison, gradeComparison, formatString }
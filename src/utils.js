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

export { gameToId, umpireToId, csvToGame, csvToUmpire }
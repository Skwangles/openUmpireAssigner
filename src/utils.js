/**
 * Takes game object and turns into a 'comparable' string
 * @param {*} info
 * @returns
 */

function gameToId(info) {
  if (!info || !info.hasOwnProperty("Time")) return null;

  return info.Date + "|" + info.Time + "|" + formatString(info.Turf);
}

/**
 * Takes objects and makes them into a 'comparable' string - note: must not draw from context specific fields, i.e. unavailable games
 * @param {*} info
 * @returns
 */
function umpireToId(info) {
  if (!info || !info.hasOwnProperty("Name")) return null;

  return formatString(info.Name) + "|" + formatString(info.Levels.join(","));
}

const gameToPlayHQ = (game) => {
  return {
    "home team": game.A,
    "away team": game.B,
    "game time": game.Time,
    "playing surface": game.Turf,
    "game date": game.Date,
    grade: game.Grade,
    "umpire 1":
      game.ump1 === null ? "{}" : jsonToCsvUsable(JSON.stringify(game.ump1)), //csv safe stringify
    "umpire 2":
      game.ump2 === null ? "{}" : jsonToCsvUsable(JSON.stringify(game.ump2)),
  };
};

/**
 * Format string into a JSON.parse usable string - including removing the escaping and 'csv safe' commas (vertical bar) back to normal commas
 * @param {*} str
 * @returns
 */
const csvJsonToParseable = (str) =>
  str.replaceAll("|", ",").replaceAll("\\", "");

/**
 * Format string into a JSON object without commas which CSVs are confused by
 * @param {string} str - input value
 * @returns string
 */
const jsonToCsvUsable = (str) => str.replaceAll(",", "|");

const csvToGame = (game) => {
  return {
    A: game["home team"],
    B: game["away team"],
    Time: game["game time"],
    Turf: stripToTurf(game["playing surface"]),
    Date: game["game date"],
    Round: game["round"],
    Grade: game["grade"].split(" ")[0]?.replace("R", ""), //e.g. MR3 Name1 Name2 -> M3
    ump1:
      !game.hasOwnProperty("umpire 1") || game["umpire 1"] === ""
        ? {}
        : JSON.parse(csvJsonToParseable(game["umpire 1"])), //csv safe unstringify
    ump2:
      !game.hasOwnProperty("umpire 2") || game["umpire 2"] === ""
        ? {}
        : JSON.parse(csvJsonToParseable(game["umpire 2"])),
  };
};

// Convert PapaParse JSON objects to internally usable objects - note, some are in CSV array format, thus .split
const csvToUmpire = (umpire) => {
  return {
    Name: umpire["Name"],
    Teams: umpire["Teams"].split(/\s*,\s*/).filter((item) => item !== "") || [],
    Levels:
      umpire["Levels"].split(/\s*,\s*/).filter((item) => item !== "") || [],
    RestrictedTurf:
      umpire["Restricted Turfs"]
        .split(/\s*,\s*/)
        .filter((item) => item !== "") || [],
    BlockoutDates:
      umpire["Blockout Dates"].split(/\s*,\s*/).filter((item) => item !== "") ||
      [],
    LimitedTimes:
      umpire["Limited Times"].split(/\s*,\s*/).filter((item) => item !== "") ||
      [],
    Club: umpire["Club"] || "",
    TBAO: umpire["To be aware of"] || "",
    Notes: umpire["Notes"] || "",
  };
};

const stripToTurf = (name) => {
  switch (name) {
    case "New World Te Rapa Turf 1":
      return "Turf 1";
    case "Lugtons Turf 2":
      return "Turf 2";
    case "St Pauls Collegiate":
      return "St Pauls";
    case "St Peters Cambridge":
      return "St Peters";
    default:
      return name;
  }
};

function timeComparison(a, b) {
  // -1 means it is higher (e.g. A > Z)
  const A_HIGHER = -1;
  const A_LOWER = 1;

  if (a.Time === b.Time) return 0;

  // Checking time (they aren't equal)
  let timeHourA = a.Time.split(":")
    .map((part) => Number(part))
    .filter((part) => !isNaN(part));
  let timeHourB = b.Time.split(":")
    .map((part) => Number(part))
    .filter((part) => !isNaN(part));

  if (timeHourA[0] !== timeHourB[0])
    return timeHourA[0] < timeHourB[0] ? A_HIGHER : A_LOWER;

  if (timeHourA[1] !== timeHourB[1])
    return timeHourA[1] < timeHourB[1] ? A_HIGHER : A_LOWER;
}

function gradeComparison(a, b) {
  return a.Grade.localeCompare(b.Grade);
}

function dateStringComparison(a, b, subpredicate = () => 0) {
  // -1 means it is higher (e.g. A > Z)
  const A_HIGHER = -1;
  const A_LOWER = 1;

  // Quick exit
  if (a.Date === b.Date) return subpredicate(a, b);

  let datePartsA = a.Date.split("/")
    .map((part) => Number(part))
    .filter((part) => !isNaN(part));
  let datePartsB = b.Date.split("/")
    .map((part) => Number(part))
    .filter((part) => !isNaN(part));

  // Year
  if (
    datePartsA.length > 2 &&
    datePartsB.length > 2 /* Assume year same if not specified */ &&
    datePartsA[2] !== datePartsB[2]
  )
    return datePartsA[2] < datePartsB[2] ? A_HIGHER : A_LOWER;

  // Month
  if (datePartsA[1] !== datePartsB[1])
    return datePartsA[1] < datePartsB[1] ? A_HIGHER : A_LOWER;

  // Day
  if (datePartsA[0] !== datePartsB[0])
    return datePartsA[0] < datePartsB[0] ? A_HIGHER : A_LOWER;

  // If all of the parts match - must be equal
  return subpredicate(a, b);
}

function formatString(string) {
  return string.toLowerCase().trim();
}

export {
  gameToId,
  umpireToId,
  csvToGame,
  csvToUmpire,
  dateStringComparison,
  timeComparison,
  gradeComparison,
  formatString,
  gameToPlayHQ,
};

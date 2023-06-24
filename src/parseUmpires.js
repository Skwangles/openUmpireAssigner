import { dateStringComparison, formatString } from "./utils";

// Time after game start to 'avoid'
const GAME_LENGTH = 78;
const MINS_IN_HOUR = 60;

/**
 * Get 'avoid' times based on the 'teams' an umpire is set to work with
 * @param {Team names to avoid games with} umpTeams
 * @param {Array of all games} games
 * @returns
 */
let getTimes = (umpire, games) => {

  // Load times of day can't do
  let avoidTimes =
    umpire.LimitedTimes?.length > 0
      ? umpire.LimitedTimes?.map((time) => {
          let times = time.split("-");
          return {
            date: null,
            start: timeStringToObj(times[0]),
            end: timeStringToObj(times[1]),
          };
        })
      : [];

  // Times during 'teams' involvement
  games.forEach((game) => {
    if (isInvolvedInGame(umpire, game)) {
      let startTime = timeStringToObj(game.Time);
      avoidTimes.push({
        date: game.Date,
        start: startTime,
        end: getEndTime(startTime, GAME_LENGTH),
      });
    }
  });
  return avoidTimes;
};

function timeStringToObj(hourMin) {
  let time = hourMin
    .split(":")
    .map((part) => Number(part))
    .filter((part) => !isNaN(part));

  if (time.length < 2) throw "Invalid time passed!";

  return { hour: time[0], min: time[1] };
}

/**
 * Based on an object with hour and min value, calculate the new valid
 * @param {*} time
 * @param {*} gameLength
 * @returns
 */
function getEndTime(time, gameLength) {
  let newMin = time.min + gameLength;
  let newHour = time.hour;
  if (newMin >= MINS_IN_HOUR) {
    newHour += Math.floor(newMin / MINS_IN_HOUR);
  }
  return { hour: newHour, min: Math.floor(newMin % MINS_IN_HOUR) };
}

/**
 * time1 <= time2 - DOES NOT HANDLE MIDNIGHT EDGE CASE
 * @param {hour & min obj} time1
 * @param {house & min obj} time2
 * @returns if time1 < time2
 */
function timeLessThanEqual(time1, time2) {
  if (time1.hour < time2.hour) {
    return true;
  } else if (time1.hour === time2.hour) {
    return time1.min <= time2.min;
  }
  return false;
}

let timeToString = (time) => String(time.hour).padStart(2, "0") + ":" + String(time.min).padStart(2, "0");

let isTimewiseIssue = (umpire, checkedGame, games, gameLength) => {
  //Handle no specified 'selectedGame'
  if (typeof checkedGame.Time === "undefined") return true;

  //Calc areas Umpire can't play in
  let avoidTimes = getTimes(umpire, games);

  //Parse game time
  let time = checkedGame.Time.split(":");
  let gameStart = { hour: parseInt(time[0]), min: parseInt(time[1]) };
  let gameEnd = getEndTime(gameStart, gameLength);

  for (const avoid of avoidTimes) {
    if (avoid.Date != null && avoid.Date !== checkedGame.Date) continue;
    //Check if any edges overlap
    if (
      (timeLessThanEqual(gameStart, avoid.end) &&
        timeLessThanEqual(avoid.start, gameEnd)) ||
      (timeLessThanEqual(avoid.start, gameEnd) &&
        timeLessThanEqual(gameStart, avoid.end))
    ) {

      //Overlap
      return (
        "Cannot do: " +
        timeToString(avoid.start) +
        "-" +
        timeToString(avoid.end) +
        (!avoid.Date ? " (Blockout)" : " on the: " +
        avoid.Date)
      );
    }
  }
  return false;
};

/**
 * Get the team the umpire is playing for, or false if neither
 * @param {*} umpire
 * @param {*} checkedGame
 * @returns
 */
let isInvolvedInGame = (umpire, checkedGame) => {
  let team = umpire.Teams.find(
    (team) =>
      formatString(team) === formatString(checkedGame.A) ||
      formatString(team) === formatString(checkedGame.B)
  );
  return team === undefined ? false : team;
};

/**
 * Checks if an umpire can play at a certain turf
 * @param {*} umpire
 * @param {*} checkedGame
 * @returns
 */
let isTurfIssue = (umpire, checkedGame) => {
  let turfMatch = umpire.RestrictedTurf.find(
    (turf) => formatString(turf) === formatString(checkedGame.Turf)
  );
  return turfMatch === undefined ? false : "Doesn't umpire at: " + turfMatch;
};

/**
 * Checks if umpire umpires this grade
 * @param {*} umpire
 * @param {*} checkedGame
 * @returns
 */
let isAbilityIssue = (umpire, checkedGame) => {
  let levelMatch = umpire.Levels.find((level) => {
    return (
      formatString(level) === formatString(checkedGame.Grade) ||
      formatString(level) === formatString("all")
    );
  });
  return levelMatch === undefined
    ? "Not in skill levels: " + umpire.Levels
    : false;
};

/**
 * Check blockout dates using util -
 * @param {*} umpire
 * @param {*} game
 * @returns
 */
let isDatewiseUnavailable = (umpire, game) => {
  const EQUAL = 0;
  return (
    umpire.BlockoutDates?.find(
      (date) => dateStringComparison({ Date: date }, game) === EQUAL
    ) || false
  );
};

function parseUmpire(umpire, games, gameLength) {
  let unavailableGames = [];

  games.forEach((game) => {
    // Check if - Datewise unavailable > Is already playing > Can make it timewise > Has the right abilities > Would even want to play (i.e. if desperate, abilties and wants are less important)

    let dateUnavailable = isDatewiseUnavailable(umpire, game);
    if (dateUnavailable) {
      unavailableGames.push({
        ...game,
        reason: "Blockout Date: " + dateUnavailable,
      });
      return; // Only let one reason be for each game
    }

    let playingFor = isInvolvedInGame(umpire, game);
    if (playingFor) {
      unavailableGames.push({
        ...game,
        reason: "Involved with: " + playingFor,
      });
      return; // Only let one reason be fore each game
    }

    let timewiseIssue = isTimewiseIssue(umpire, game, games, gameLength);
    if (timewiseIssue) {
      unavailableGames.push({ ...game, reason: "Time: " + timewiseIssue });
      return;
    }

    // Check umpire WANTS to do it
    let turfIssue = isTurfIssue(umpire, game);
    if (turfIssue) {
      unavailableGames.push({ ...game, reason: "Turf: " + turfIssue });
      return;
    }

    let abilitiesIssue = isAbilityIssue(umpire, game);
    if (abilitiesIssue) {
      unavailableGames.push({ ...game, reason: "Levels: " + abilitiesIssue });
      return;
    }
  });

  return unavailableGames;
}

export default parseUmpire;

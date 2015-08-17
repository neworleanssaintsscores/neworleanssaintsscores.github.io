/**
 * nfl_game_stats.js
 *
 * @author Eric Metcalf
 * @requires DayHours.js
 */

/**
 * Returns manageable array of game stats from array of NFL game stats.
 *
 * @param {Array} List of NFL game stats from the NFL website
 * @return {Array} List of game stat classes that are easy to work
 */
function getGameStats(jsonGameStats) {
  var gameStats = [];
  var season = new Season(jsonGameStats[0].length);
  for (var i = 0; i < jsonGameStats.length; i++) {
    gameStats.push(season.getGameStats(jsonGameStats[i]));
  }
  return gameStats;
}

/**
 * Class containing season type and retrieves game stats for that season.
 *
 * @param {int} Number of fields for a NFL game stats.
 */
function Season(numFields) {
  if (numFields == 14) {
    this.seasonName = "regular";
    this.getGameStats = function(gameData) { return getRegularSeasonGameStats(gameData) };
  } else if (numFields == 17) {
    this.seasonName = "post";
    this.getGameStats = function(gameData) { return getPostSeasonGameStats(gameData) };
  }
}

Season.prototype.toString = function() {
  return this.seasonName;
}

/**
 * Gets game data for a regular season game.
 */
function getRegularSeasonGameStats(gameData) {
  return new GameStats(
    gameData[0],
    gameData[1],
    gameData[2],
    gameData[3],
    gameData[4],
    gameData[5],
    gameData[6],
    gameData[7],
    gameData[8],
    gameData[9],
    gameData[10],
    // Skip 11 since unknown.
    gameData[12], // Split this ("REG15") into 2?
    gameData[13]
  );
}

/**
 * Gets game data for a post season game.
 */
function getPostSeasonGameStats(gameData) {
  return new GameStats(
    gameData[0],
    gameData[1],
    gameData[2],
    gameData[3],
    // Skip 4 full team name (full city name + mascot).
    gameData[5],
    gameData[6],
    // Skip 7 full team name (full city name + mascot).
    gameData[8],
    gameData[9],
    gameData[10],
    gameData[11],
    gameData[12],
    // Skip 13 since unknown.
    // Skip 14 broadcast tv network
    gameData[15], // Split this ("REG15") into 2?
    gameData[16]
  );
}

/**
 * Class containing stats for an NFL game.
 */
function GameStats(gameDay, gameTime, quarter, timeInQuarter, awayTeam, awayTeamScore, homeTeam,
    homeTeamScore, teamWithPossession, isInRedZone, id, gameType, gameYear) {
  this.gameDay = gameDay;
  this.gameTime = getOffsetGameTime(gameTime);
  this.quarter = quarter; // TODO Rename this to something else since not always a quarter.
  this.timeInQuarter = timeInQuarter;
  this.awayTeam = new Team(awayTeam);
  this.awayTeamScore = awayTeamScore;
  this.homeTeam = new Team(homeTeam);
  this.homeTeamScore = homeTeamScore;
  this.teamWithPossession = teamWithPossession;
  this.isInRedZone = isInRedZone;
  this.id = id;
  this.gameType = gameType;
  this.gameYear = gameYear;
}

/**
 * Returns local time given eastern time in HH:MM format.
 *
 * @return {string} Local time in HH:MM format
 */
function getOffsetGameTime(gameTime) {
  var splitGameTime = gameTime.split(":");
  
  // TODO move the code that gets timezoneOffsetFromEastern so it's not calculated multiple times.
  var localTime = new Date();
  var localTimeaoneOffset = -(localTime.getTimezoneOffset() / 60);
  
  var easternTimezoneOffset = -5; // Time zone given to us from JSON.
  var timezoneOffsetFromEastern = localTimeaoneOffset + -(easternTimezoneOffset);
  
  var dayHours = new DayHours(parseInt(splitGameTime[0]));
  if (timezoneOffsetFromEastern < 0) {
    dayHours.subtractHours(Math.abs(timezoneOffsetFromEastern));
  } else {
    dayHours.addHours(timezoneOffsetFromEastern);
  }
  return (dayHours.currentHour + ":" + splitGameTime[1]);
}

/**
 * Class containing attributes of an NFL team.
 */
function Team(abbrCityName) {
  this.abbrCityname = abbrCityName;
  this.getMascotName = GetMascotName;
}

Team.prototype.toString = function teamToString() {
  return this.abbrCityname;
}

/**
 * Returns mascot name for given city.
 *
 * @return {string} Mascot name
 */
function GetMascotName() {
  var mascotName;
  switch(this.abbrCityname) {
    case "ARI":
      mascotName = "Cardinals";
      break;
    case "ATL":
      mascotName = "Falcons";
      break;
    case "BAL":
      mascotName = "Ravens";
      break;
    case "BUF":
      mascotName = "Bills";
      break;
    case "CAR":
      mascotName = "Panthers";
      break;
    case "CHI":
      mascotName = "Bears";
      break;
    case "CIN":
      mascotName = "Bengals";
      break;
    case "CLE":
      mascotName = "Browns";
      break;
    case "DAL":
      mascotName = "Cowboys";
      break;
    case "DEN":
      mascotName = "Broncos";
      break;
    case "DET":
      mascotName = "Lions";
      break;
    case "GB":
      mascotName = "Packers";
      break;
    case "HOU":
      mascotName = "Texans";
      break;
    case "IND":
      mascotName = "Colts";
      break;
    case "JAC":
      mascotName = "Jaguars";
      break;
    case "KC":
      mascotName = "Cheifs";
      break;
    case "MIA":
      mascotName = "Dolphins";
      break;
    case "MIN":
      mascotName = "Vikings";
      break;
    case "NE":
      mascotName = "Patriots";
      break;
    case "NO":
      mascotName = "Saints";
      break;
    case "NYJ":
      mascotName = "Jets";
      break;
    case "NYG":
      mascotName = "Giants";
      break;
    case "OAK":
      mascotName = "Raiders";
      break;
    case "PHI":
      mascotName = "Eagles";
      break;
    case "PIT":
      mascotName = "Steelers";
      break;
    case "SD":
      mascotName = "Chargers";
      break;
    case "SEA":
      mascotName = "Seahawks";
      break;
    case "SF":
      mascotName = "49ers";
      break;
    case "STL":
      mascotName = "Rams";
      break;
    case "TB":
      mascotName = "Buccaneers";
      break;
    case "TEN":
      mascotName = "Titans";
      break;
    case "WAS":
      mascotName = "Redskins";
      break;
  }
  return mascotName;
}

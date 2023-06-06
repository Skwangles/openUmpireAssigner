import Game from './Game';
import { gameToId } from './utils.js'
import "./Games.css"

/**
 * Track which umpires are in use and how many games
 * @param {*} games 
 * @param {*} setUsedUmpires 
 */
function updateUsedUmpires(games, setUsedUmpires) {

    // Count times an umpire has been assigned
    let usedUmpires = {}
    games.forEach(game => {
        if (game.ump1 != null)
            usedUmpires[game.ump1.name] > 0 ? usedUmpires[game.ump1.name] += 1 : usedUmpires[game.ump1.name] = 1
        if (game.ump2 != null)
            usedUmpires[game.ump2.name] > 0 ? usedUmpires[game.ump2.name] += 1 : usedUmpires[game.ump2.name] = 1
    });

    setUsedUmpires(usedUmpires)
}


/**
 * Displays games - grays out non-available games
 * @param {*} props - Contains all the props needed to display, filter, etc
 * @returns 
 */
function Games({ games, highlightType, setGames, setSelectedGame, selectedUmpire }) {


    // Update overall game object
    let updateGameValue = (key, newGame) => {
        let indexOfGame = -1;

        // Find index matching
        for (const index in games) {
            let item = games[index]
            if (item.Time + "|" + item.Turf === key) {
                indexOfGame = index
                break;
            }
        }
        if (indexOfGame < 0) return false

        //Update game object
        games[indexOfGame] = newGame
        setGames(games)
    }


    // Disable games by umpire
    if (highlightType === "umpire" && selectedUmpire.hasOwnProperty("name")) {
        console.log("Filtering out games")
        games = games.map(game => {

            // Check if umpire disabled for game & attach reason
            let invalidGame = selectedUmpire.blockedGames.find(checkedGame => gameToId(game) === gameToId(checkedGame))
            if(invalidGame !== undefined)
                return { ...game, isDisabled: true, reason: invalidGame.reason || "None" }

            return { ...game, isDisabled: false }

        });
    }


    return (
        <table>

            {/* Table titles*/}
            <thead>
                <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>Grade</th>
                    <th>Time</th>
                    <th>Turf</th>
                    <th>Umpire 1</th>
                    <th>Umpire 2</th>
                </tr>
            </thead>

            <tbody>
                {/*Games with info*/}
                {games.length > 0 ? games.map(game => <Game key={gameToId(game)} id={gameToId(game)} game={game} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game>) : <tr><td colSpan={5}>None</td></tr>}
            </tbody>
        </table>
    );
}

export default Games;
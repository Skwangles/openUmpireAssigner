import Game from './Game';
import { gameToId } from './utils.js'
import "./Games.css"


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
            if (gameToId(item) === key) {
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
    if (highlightType === "umpire" && selectedUmpire.hasOwnProperty("Name")) {
        console.log("Selected umpire")
        console.log(selectedUmpire)
        console.log(games)
        games = games.map(game => {

            // Check if umpire disabled for game & attach reason
            let invalidGame = selectedUmpire.blockedGames.find(checkedGame => gameToId(game) === gameToId(checkedGame))
            if(invalidGame !== undefined)
                return { ...game, isDisabled: true, reason: invalidGame.reason || "None" }

            return { ...game, isDisabled: false }

        });
    }
    else {
        games = games.map(game => { return {...game, isDisabled: false}})
    }

    console.log("Current Games")
    console.log(games)

    return (
        <table>

            {/* Table titles*/}
            <thead>
                <tr>
                    <th>Date</th>
                    <th>A</th>
                    <th>B</th>
                    <th>Grade</th>
                    <th>Time</th>
                    <th>Turf</th>
                    <th>Umpire 1</th>
                    <th>Umpire 2</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {/*Games with info*/}
                {games.length > 0 ? games.map(game => <Game key={gameToId(game)} id={gameToId(game)} game={game} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game>) : <tr><td colSpan={9}>None</td></tr>}
            </tbody>
        </table>
    );
}

export default Games;
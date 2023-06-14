import Game from './Game';
import { dateStringComparison, gameToId } from './utils.js'
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
                return { ...game, isUnavailable: true, reason: invalidGame.reason || "None" }

            return { ...game, isUnavailable: false }

        });
    }
    else {
        games = games.map(game => { return {...game, isUnavailable: false}})
    }

    console.log("Current Games")
    console.log(games)

    return (
        <table className="table w-75">
            <thead className='table-dark'>
                <tr>
                    <th scope="col" >Date</th>
                    <th scope="col" >A</th>
                    <th scope="col">B</th>
                    <th scope="col">Grade</th>
                    <th scope="col">Time</th>
                    <th scope="col">Turf</th>
                    <th scope="col">Umpire 1</th>
                    <th scope="col">Umpire 2</th>
                    <th scope="col">Notes</th>
                </tr>
            </thead>

            <tbody>
                {/*Games with info*/}
                {games.length > 0 ? games
                .sort((a,b) => dateStringComparison(a,b))
                .map(game => <Game key={gameToId(game)} id={gameToId(game)} game={game} setSelectedGame={setSelectedGame} updateGameValue={updateGameValue}></Game>) : <tr><td colSpan={9}>None</td></tr>}
            </tbody>
        </table>
    );
}

export default Games;
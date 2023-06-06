function gameToId(info) {
    if (!info || !info.hasOwnProperty("Time")) return null

    return info.Date + "|" + info.Time + "|" + info.Turf
}

function umpireToId(info) {
    if (!info || !info.hasOwnProperty("Name")) return null

    return info.Name + "|" + info.Levels.join(",")
}

export { gameToId, umpireToId }
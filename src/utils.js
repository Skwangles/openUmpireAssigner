function gameToId(info) {
    if (!info) return null

    return info.Date + "|" + info.Time + "|" + info.Turf
}

function umpireToId(info) {
    if (!info) return null

    return info.Name + "|" + info.levels.join(",")
}

export { gameToId, umpireToId }
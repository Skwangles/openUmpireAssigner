function gameToId(info){
    return info.Time + "|" + info.Turf
}

function umpireToId(info){
    return info.name + "|" + info.skillLevel
}

export {gameToId, umpireToId}
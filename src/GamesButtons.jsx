import React from 'react'
import { Button } from "react-bootstrap";

export default function GamesButtons({ setSortByTime }) {
  return (
    <div style={{display: "flex", flexDirection: "row", padding: "5px", gap: "3px"}}>
        <Button className="btn-sm" onClick={() => setSortByTime(true)}>
          Sort by Time
        </Button>
        <Button className="btn-sm" onClick={() => setSortByTime(false)}>
          Sort by Grade
        </Button>
    </div>
  )
}


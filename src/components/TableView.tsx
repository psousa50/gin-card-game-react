import React from "react"
import { Game } from "../gin-card-game/Game/model"
import { HandView } from "./HandView"
import { DeckView } from "./DeckView"
import { OnMove } from "../models"

require("./TableView.css")

interface TableViewProps {
  game: Game | undefined
  onMove: OnMove
}

const cardWidth = 80

export const TableView: React.FC<TableViewProps> = props => (
  <div className="table">{props.game ? <TableView2 game={props.game} onMove={props.onMove} /> : null}</div>
)

interface TableView2Props {
  game: Game
  onMove: OnMove
}

const TableView2: React.FC<TableView2Props> = ({ game, onMove }) => {
  const topPlayer = game.players[1]
  const bottomPlayer = game.players[0]

  return (
    <div className="table">
      <div className="topRow">
        <HandView playerId={topPlayer.id} hand={topPlayer.hand} cardWidth={cardWidth} onMove={onMove} />
      </div>
      <div className="mid-row">
        <div className="mid-row-trick">
          <DeckView discardPile={game.discardPile} playerId={bottomPlayer.id} onMove={onMove} cardWidth={cardWidth} />
        </div>
      </div>
      <div className="bottom-row">
        <HandView playerId={bottomPlayer.id} hand={bottomPlayer.hand} cardWidth={cardWidth} onMove={onMove} />
      </div>
    </div>
  )
}

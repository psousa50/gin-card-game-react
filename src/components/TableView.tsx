import React from "react"
import * as Games from "../gin-card-game/Game/domain"
import { Game } from "../gin-card-game/Game/model"
import { HandView } from "./HandView"
import { DeckView } from "./DeckView"
import { OnMove } from "../models"
import { MeldsView } from "./MeldsView"

require("./TableView.css")

interface TableViewProps {
  game: Game | undefined
  onMove: OnMove
}

const cardWidth = 80

export const TableView: React.FC<TableViewProps> = props =>
  props.game ? <TableRunningView game={props.game} onMove={props.onMove} /> : null

interface TableView2Props {
  game: Game
  onMove: OnMove
}

const TableRunningView: React.FC<TableView2Props> = ({ game, onMove }) => {
  const topPlayer = game.players[1]
  const bottomPlayer = game.players[0]
  const result = Games.result(game)

  return (
    <div className="table">
      <HandView playerId={topPlayer.id} hand={topPlayer.hand} cardWidth={cardWidth} onMove={onMove} />
      <MeldsView cardWidth={cardWidth} hand={topPlayer.hand} />
      <DeckView discardPile={game.discardPile} onMove={onMove} cardWidth={cardWidth} />
      <div>
        {result.scores.map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
      <HandView playerId={bottomPlayer.id} hand={bottomPlayer.hand} cardWidth={cardWidth} onMove={onMove} />
      <MeldsView cardWidth={cardWidth} hand={bottomPlayer.hand} />
    </div>
  )
}

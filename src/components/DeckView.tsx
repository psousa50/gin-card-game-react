import React from "react"
import * as Moves from "../gin-card-game/Moves/domain"
import { CardView } from "./CardView"
import { Card } from "../gin-card-game/Cards/model"
import { OnMove } from "../models"
import { MoveType } from "../gin-card-game/Moves/model"

require("./DeckView.css")

interface DeckViewProps {
  discardPile: Card[]
  onMove: OnMove
  cardWidth: number
}

export const DeckView: React.FC<DeckViewProps> = ({ discardPile, onMove, cardWidth }) => (
  <div className="deck">
    <div className="cards">
      <CardView cardWidth={cardWidth} faceDown={true} onClick={() => onMove(Moves.create(MoveType.DrawCard))} />
    </div>
    <div className="cards">
      <CardView card={discardPile[0]} cardWidth={cardWidth} onClick={() => onMove(Moves.create(MoveType.PickCard))} />
    </div>
    <button onClick={() => onMove(Moves.create(MoveType.Pass))}>{"PASS"}</button>
  </div>
)

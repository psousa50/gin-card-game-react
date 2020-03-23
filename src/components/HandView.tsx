import React from "react"
import * as Moves from "../gin-card-game/Moves/domain"
import { Hand, suitOrder, Card } from "../gin-card-game/Cards/model"
import { CardView } from "./CardView"
import { PlayerId } from "../gin-card-game/Players/model"
import { OnMove } from "../models"
import { sort } from "ramda"

require("./HandView.css")

interface HandViewProp {
  playerId: PlayerId
  hand: Hand
  cardWidth: number
  onMove: OnMove
}

 const order = (card1: Card, card2: Card) =>
  card1.faceValue === card2.faceValue ?  suitOrder[card1.suit] - suitOrder[card2.suit] : card1.faceValue - card2.faceValue

  export const HandView: React.FC<HandViewProp> = ({ cardWidth, hand, onMove }) => (
  <div className="hand-horizontal">
    {sort(order, hand).map(card => (
      <div key={`${card.faceValue}-${card.suit}`} style={{ marginLeft: -cardWidth * 0.7 }}>
        <CardView card={card} width={cardWidth} onClick={card => card && onMove(Moves.createDiscardCardMove(card))} />
      </div>
    ))}
  </div>
)

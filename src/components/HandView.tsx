import React from "react"
import * as Melds from "../gin-card-game/Game/melds"
import * as Moves from "../gin-card-game/Moves/domain"
import { Hand, suitOrder, Card } from "../gin-card-game/Cards/model"
import { CardView } from "./CardView"
import { PlayerId } from "../gin-card-game/Players/model"
import { OnMove } from "../models"
import { sort } from "ramda"

import { toSymbol } from "../gin-card-game/Cards/domain"

require("./HandView.css")

interface HandViewProp {
  playerId: PlayerId
  hand: Hand
  cardWidth: number
  onMove: OnMove
}

const order = (card1: Card, card2: Card) =>
  card1.faceValue === card2.faceValue
    ? suitOrder[card1.suit] - suitOrder[card2.suit]
    : card1.faceValue - card2.faceValue

export const HandView: React.FC<HandViewProp> = ({ cardWidth, hand, onMove }) => {
  const melds = Melds.findMinimalDeadwood(hand)

  return (
    <div className="hand-horizontal">
      <CardListView cards={melds.deadwood} cardWidth={cardWidth} onMove={onMove} />
      {melds.sets.map((set, i) => (
        <CardListView key={i} cards={set} cardWidth={cardWidth} onMove={onMove} />
      ))}
      {melds.runs.map((run, i) => (
        <CardListView key={i} cards={run} cardWidth={cardWidth} onMove={onMove} />
      ))}
    </div>
  )
}

interface CardListViewProps {
  cards: Card[]
  cardWidth: number
  onMove: OnMove
}

const CardListView: React.FC<CardListViewProps> = ({ cards, cardWidth, onMove }) => (
  <>
    {sort(order, cards).map((card, i) => (
      <div key={toSymbol(card)} style={i === 0 ? {} : { marginLeft: -cardWidth * 0.7 }}>
        <CardView
          card={card}
          cardWidth={cardWidth}
          onClick={card => card && onMove(Moves.createDiscardCardMove(card))}
        />
      </div>
    ))}
    <EmptyCardView cardWidth={cardWidth} />
  </>
)

interface EmptyCardView {
  cardWidth: number
}
const EmptyCardView: React.FC<EmptyCardView> = ({ cardWidth }) => (
  <div style={{ marginLeft: -cardWidth * 0.7 }}>
    <CardView cardWidth={cardWidth} />
  </div>
)

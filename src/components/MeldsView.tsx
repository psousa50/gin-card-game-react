import React from "react"
import * as Melds from "../gin-card-game/Game/melds"
import { Card } from "../gin-card-game/Cards/model"
import { toSymbol } from "../gin-card-game/Cards/domain"
import { CardView } from "./CardView"

interface MeldsViewProps {
  hand: Card[]
  cardWidth: number
}

interface SmallCardsListOfCardsProps {
  cardWidth: number
  cardsList: Card[][]
}

export const MeldsView: React.FC<MeldsViewProps> = ({ cardWidth, hand }) => {
  const melds = Melds.findAllPossibleMelds(hand)

  return melds ? (
    <div>
      <SmallCardsListOfCards cardWidth={cardWidth} cardsList={melds.runs} />
      <SmallCardsListOfCards cardWidth={cardWidth} cardsList={melds.sets} />
      <SmallCardsList cardWidth={cardWidth} cards={melds.deadwood} />
    </div>
  ) : null
}

export const SmallCardsListOfCards: React.FC<SmallCardsListOfCardsProps> = ({ cardsList, cardWidth }) => (
  <>
    {cardsList.map((cards, i) => (
      <SmallCardsList key={i} cardWidth={cardWidth} cards={cards} />
    ))}
  </>
)

interface SmallCardsListProps {
  cardWidth: number
  cards: Card[]
}

export const SmallCardsList: React.FC<SmallCardsListProps> = ({ cards, cardWidth }) => (
  <div className="small-cards-list">
    {cards.map(card => (
      <div key={toSymbol(card)} style={{ marginLeft: -cardWidth * 0.7 }}>
        <CardView small width={cardWidth} card={card} />
      </div>
    ))}
  </div>
)

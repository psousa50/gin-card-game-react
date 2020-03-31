import React from "react"
import * as Melds from "../gin-card-game/Game/melds"
import { Card } from "../gin-card-game/Cards/model"
import { toSymbol } from "../gin-card-game/Cards/domain"
import { getCardImages } from "../images/cards"

require("./MeldsView.css")

interface MeldsViewProps {
  hand: Card[]
  cardWidth: number
}

interface SmallCardsListOfCardsProps {
  cardWidth: number
  cardsList: Card[][]
}

export const MeldsView: React.FC<MeldsViewProps> = ({ cardWidth, hand }) => {
  const melds = Melds.findMinimalDeadwood(hand)

  return melds ? (
    <div className="melds">
      <SmallCardsListOfCards cardWidth={cardWidth} cardsList={melds.runs} />
      <SmallCardsListOfCards cardWidth={cardWidth} cardsList={melds.sets} />
      <SmallCardsList cardWidth={cardWidth} cards={melds.deadwood} />
      <div className="deadwood">{melds.deadwoodValue}</div>
    </div>
  ) : null
}

export const SmallCardsListOfCards: React.FC<SmallCardsListOfCardsProps> = ({ cardsList, cardWidth }) => (
  <div className="small-cards-list-of-cards">
    {cardsList.map((cards, i) => (
      <SmallCardsList key={i} cardWidth={cardWidth} cards={cards} />
    ))}
  </div>
)

interface SmallCardsListProps {
  cardWidth: number
  cards: Card[]
}

export const SmallCardsList: React.FC<SmallCardsListProps> = ({ cards, cardWidth }) => (
  <div className="small-cards-list">
    {cards.map((card, i) => (
      <div key={toSymbol(card)} style={i === 0 ? {} : { marginLeft: -cardWidth * 0.7 }}>
        <SmallCardView card={card} />
      </div>
    ))}
  </div>
)

interface SmallCardViewProps {
  card: Card
}

const SmallCardView: React.FC<SmallCardViewProps> = ({ card }) => (
  <img className={"clip"} width={100} height={150} src={getCardImages(card)} alt=""></img>
)

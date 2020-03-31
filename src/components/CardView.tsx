import React from "react"
import { Card } from "../gin-card-game/Cards/model"
import { getCardImages, faceDownCard, emptyCard } from "../images/cards"

require("./CardView.css")

const width = 167.0869141
const height = 242.6669922
const aspectRatio = height / width

export const getHeight = (width: number) => aspectRatio * width

interface CardViewProps {
  card?: Card
  faceDown?: boolean
  cardWidth: number
  onClick?: (card?: Card) => void
}

export const CardView: React.FC<CardViewProps> = ({ card, faceDown, onClick, cardWidth }) => (
  <div className="card" onClick={() => onClick && onClick(card)}>
    <img
      width={cardWidth}
      height={getHeight(cardWidth)}
      src={card ? getCardImages(card) : faceDown ? faceDownCard : emptyCard}
      alt=""
    ></img>
  </div>
)

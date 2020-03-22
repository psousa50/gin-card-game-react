import React from "react"
import { Card } from "../gin-card-game/Cards/model"
import { getCardImages, emptyFaceDown } from "../images/cards"

require ("./CardView.css")

const width = 167.0869141
const height = 242.6669922
const aspectRatio = height / width

export const getHeight = (width: number) => aspectRatio * width

interface CardViewProps {
  card?: Card
  width: number
  onClick?: (card?: Card) => void
}

export const CardView: React.FC<CardViewProps> = ({ card, onClick, width }) => (
  <div className="card" onClick={() => onClick && onClick(card)}>
    <img width={width} height={getHeight(width)} src={card ? getCardImages(card) : emptyFaceDown} alt=""></img>
  </div>
)

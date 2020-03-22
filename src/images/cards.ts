import { Card } from "../gin-card-game/Cards/model"

type indexed = { [k: string]: string }

export const emptyCard = require("./cards/card-empty.png")
export const emptyFaceDown = require("./cards/card-facedown.png")

const cardImages: indexed  = {
  card1C: require("./cards/1C.svg"),
  card1D: require("./cards/1D.svg"),
  card1H: require("./cards/1H.svg"),
  card1S: require("./cards/1S.svg"),
  card10C: require("./cards/10C.svg"),
  card10D: require("./cards/10D.svg"),
  card10H: require("./cards/10H.svg"),
  card10S: require("./cards/10S.svg"),
  card11C: require("./cards/11C.svg"),
  card11D: require("./cards/11D.svg"),
  card11H: require("./cards/11H.svg"),
  card11S: require("./cards/11S.svg"),
  card12C: require("./cards/12C.svg"),
  card12D: require("./cards/12D.svg"),
  card12H: require("./cards/12H.svg"),
  card12S: require("./cards/12S.svg"),
  card13C: require("./cards/13C.svg"),
  card13D: require("./cards/13D.svg"),
  card13H: require("./cards/13H.svg"),
  card13S: require("./cards/13S.svg"),
  card2C: require("./cards/2C.svg"),
  card2D: require("./cards/2D.svg"),
  card2H: require("./cards/2H.svg"),
  card2S: require("./cards/2S.svg"),
  card3C: require("./cards/3C.svg"),
  card3D: require("./cards/3D.svg"),
  card3H: require("./cards/3H.svg"),
  card3S: require("./cards/3S.svg"),
  card4C: require("./cards/4C.svg"),
  card4D: require("./cards/4D.svg"),
  card4H: require("./cards/4H.svg"),
  card4S: require("./cards/4S.svg"),
  card5C: require("./cards/5C.svg"),
  card5D: require("./cards/5D.svg"),
  card5H: require("./cards/5H.svg"),
  card5S: require("./cards/5S.svg"),
  card6C: require("./cards/6C.svg"),
  card6D: require("./cards/6D.svg"),
  card6H: require("./cards/6H.svg"),
  card6S: require("./cards/6S.svg"),
  card7C: require("./cards/7C.svg"),
  card7D: require("./cards/7D.svg"),
  card7H: require("./cards/7H.svg"),
  card7S: require("./cards/7S.svg"),
  card8C: require("./cards/8C.svg"),
  card8D: require("./cards/8D.svg"),
  card8H: require("./cards/8H.svg"),
  card8S: require("./cards/8S.svg"),
  card9C: require("./cards/9C.svg"),
  card9D: require("./cards/9D.svg"),
  card9H: require("./cards/9H.svg"),
  card9S: require("./cards/9S.svg"),
}

export const getCardImages = (card: Card) => {
  const key = `card${card.faceValue}${card.suit.substr(0, 1)}`
  return cardImages[key]
}

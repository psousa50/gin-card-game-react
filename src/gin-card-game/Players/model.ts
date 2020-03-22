import { Hand } from "../Cards/model"

export type PlayerId = string

export type Player = {
  id: PlayerId
  type: string,
  name: string
  hand: Hand
}
import { Game } from "../Game/model"
import { Player } from "../Players/model"
import { PlayerEvent, PlayerEventType, PlayerEventTarget } from "./model"

const createPlayerEventBase = (
  target: PlayerEventTarget,
  { hand, id, name, type }: Player,
  {
    currentPlayerIndex,
    discardPile,
    moveCounter,
    playersCount,
    stage,
  }: Game,
) => ({
  game: {
    currentPlayerIndex,
    discardPile,
    moveCounter,
    playersCount,
    stage,
  },
  player: {
    hand,
    id,
    name,
    type,
  },
  target  ,
})

export const createPlayerEvent = (type: PlayerEventType, player: Player, game: Game): PlayerEvent => ({
  ...createPlayerEventBase(player.id, player, game),
  type,
}) as PlayerEvent

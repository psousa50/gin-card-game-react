import { Move } from "./gin-card-game/Moves/model";
import { PlayerId } from "./gin-card-game/Players/model";

export type OnMove = (playerId: PlayerId) => (move: Move) => void

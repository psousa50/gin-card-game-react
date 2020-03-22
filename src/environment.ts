import { Environment } from "./gin-card-game/Environment/model"
import { actionOf } from "./gin-card-game/utils/actions"

export const defaulEnvironment: Environment = {
  notify: () =>  game => actionOf(game),
}

import React from "react"
import * as Players from "../gin-card-game/Players/domain"
import * as GameModel from "../gin-card-game/Game/model"
import * as Games from "../gin-card-game/Game/domain"
import * as Decks from "../gin-card-game/Deck/domain"
import { TableView } from "./TableView"
import { PlayerEvent, PlayerEventType } from "../gin-card-game/Events/model"
import { findBestMove } from "../gin-card-game/AI/mcts"
import { randomElement } from "../gin-card-game/utils/misc"
import { getEitherRight, GameResult } from "../gin-card-game/utils/actions"
import { buildEnvironment } from "../gin-card-game/Environment/domain"
import { Move } from "../gin-card-game/Moves/model"
import { OnMove } from "../models"

require("./GameView.css")

enum PlayerType {
  Random = "Random",
  MCTS = "MCTS",
  Human = "Human",
}

const randomMove = (event: PlayerEvent) => randomElement(Games.validMoves(event.game))

const mctsMove = (event: PlayerEvent) => findBestMove(event.game, event.player, { timeLimitMs: 2000 })

type PlayFunction = (event: PlayerEvent) => Move | undefined
type PlayFunctions = {
  [k: string]: PlayFunction
}

const play: PlayFunctions = {
  [PlayerType.Human]: () => undefined,
  [PlayerType.Random]: randomMove,
  [PlayerType.MCTS]: mctsMove,
}

const p1 = Players.create("p1", "Player 1", PlayerType.MCTS)
const p2 = Players.create("p2", "Player 2", PlayerType.MCTS)
const players = [p1, p2]

interface GameState {
  game: GameModel.Game | undefined
  error: ""
}

export const GameView = () => {
  const [gameState, setGameState] = React.useState<GameState>({
    game: undefined,
    error: "",
  })

  // React.useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (gameState.game && gameState.game.stage === GameModel.GameStage.Playing) {
  //       nextPlay()
  //     }
  //   }, 100)
  //   return () => clearTimeout(timer)
  // })

  const mergeState = (newState: Partial<GameState>) => {
    setGameState(state => ({ ...state, ...newState }))
  }
  const setGame = (game: GameResult) => {
    mergeState({ game: getEitherRight(game(buildEnvironment())) })
  }

  const startGame = () => {
    const deck = Decks.create()
    const game = Games.act(Games.create(players, deck))(Games.start)
    setGame(game)
  }

  const doMove: OnMove = playerId => move => {
    gameState.game && move && setGame(Games.act(gameState.game)(Games.play(playerId, move)))
  }

  const processEvent = (event: PlayerEvent) => {
    switch (event.type) {
      case PlayerEventType.PlayStage1:
      case PlayerEventType.PlayStage2:
        const move = play[event.player.type](event)
        move && doMove(event.player.id)(move)
    }
  }

  const processEvents = (events: PlayerEvent[]) => events.forEach(processEvent)

  const nextPlay = () => {
    gameState.game && processEvents(gameState.game.events)
  }

  return (
    <div className="game">
      <button onClick={startGame}>{"START"}</button>
      <button onClick={nextPlay}>{"PLAY"}</button>
      <div>{gameState.error}</div>
      <div>{gameState.game ? Games.currentPlayer(gameState.game).name : ""}</div>
      <TableView game={gameState.game} onMove={doMove} />
    </div>
  )
}

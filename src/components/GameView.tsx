import React from "react"
import * as Players from "../gin-card-game/Players/domain"
import * as GameModel from "../gin-card-game/Game/model"
import * as Games from "../gin-card-game/Game/domain"
import * as Decks from "../gin-card-game/Deck/domain"
import { TableView } from "./TableView"
import { PlayerEvent, PlayerEventType } from "../gin-card-game/Events/model"
import { findBestMove } from "../gin-card-game/AI/mcts"
import { randomElement, lj } from "../gin-card-game/utils/misc"
import { getEitherRight, GameResult } from "../gin-card-game/utils/actions"
import { buildEnvironment } from "../gin-card-game/Environment/domain"
import { Move } from "../gin-card-game/Moves/model"
import { OnMove } from "../models"
import { PlayerId } from "../gin-card-game/Players/model"

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

const p1 = Players.create("p1", "Player 1", PlayerType.Human)
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

  // const mergeState = (newState: Partial<GameState>) => {
  //   setGameState(state => ({ ...state, ...newState }))
  // }

  const getGame = (gameResult: GameResult) => getEitherRight(gameResult(buildEnvironment()))

  const startGame = () => {
    const deck = Decks.create()
    const game = getGame(Games.act(Games.create(players, deck))(Games.start))
    setGameState({ game, error: "" })
  }

  const doMove = (playerId: PlayerId) => (move: Move) => {
    setGameState(state => ({
      ...state,
      game: state.game && move && getGame(Games.act(state.game)(Games.extractEvents, Games.play(playerId, move))),
    }))
  }

  const onMove: OnMove = move => gameState.game && doMove(Games.currentPlayer(gameState.game).id)(move)

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
    gameState.game &&
      processEvents(
        gameState.game.events.filter(e => gameState.game && e.target === Games.currentPlayer(gameState.game).id),
      )
  }

  return (
    <div className="game">
      <button onClick={startGame}>{"START"}</button>
      <button onClick={nextPlay}>{"PLAY"}</button>
      <div>{gameState.error}</div>
      <div>{gameState.game ? Games.currentPlayer(gameState.game).name : ""}</div>
      <TableView game={gameState.game} onMove={onMove} />
    </div>
  )
}

import React from "react"
import * as Players from "../gin-card-game/Players/domain"
import * as GameModel from "../gin-card-game/Game/model"
import * as Games from "../gin-card-game/Game/domain"
import * as Decks from "../gin-card-game/Deck/domain"
import { TableView } from "./TableView"
import { PlayerEvent, PlayerEventType } from "../gin-card-game/Events/model"
import * as MCTS  from "../gin-card-game/AI/mcts"
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

const mctsMove = (event: PlayerEvent) => MCTS.findBestMove(event.game, event.player, { timeLimitMs: 5000 })

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

interface GameViewState {
  game: GameModel.Game
}

const shuffledDeck = () => Decks.shuffle(Decks.create())

const createGame = () => Games.create(players, shuffledDeck())

export const GameView = () => {
  const [gameState, setGameState] = React.useState<GameViewState>({
    game: createGame(),
  })

  const { game } = gameState

  const getGame = (gameResult: GameResult) => getEitherRight(gameResult(buildEnvironment()))

  const startGame = () => {
    const game = getGame(Games.act(gameState.game)(Games.restart(shuffledDeck())))
    setGameState({ game })
  }

  type GameRunningViewProps = {
    game: GameModel.Game
    onGameChanged: (game: GameModel.Game) => void
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (game.stage === GameModel.GameStage.Playing) {
        // processEvents()
      }
    }, 100)
    return () => clearTimeout(timer)
  })

  const doMove = (playerId: PlayerId) => (move: Move) => {
    lj("MOVE", { player: playerId, move })
    setGameState(state => ({
      game: getGame(Games.act(state.game)(Games.extractEvents, Games.play(playerId, move))),
    }))
  }

  const onMove: OnMove = move => game && doMove(Games.currentPlayer(game).id)(move)

  const processEvent = (event: PlayerEvent) => {
    switch (event.type) {
      case PlayerEventType.PlayStage1:
      case PlayerEventType.PlayStage2:
        const move = play[event.player.type](event)
        move && doMove(event.player.id)(move)
    }
  }

  const processEvents = () => {
    game.events.filter(e => game && e.target === Games.currentPlayer(game).id).forEach(processEvent)
  }

  return (
    <div className="game">
      <div className="actions">
        <button onClick={startGame}>{"START"}</button>
        <button onClick={processEvents}>{"PLAY"}</button>
      </div>
      {/* <div>{error}</div> */}
      <div className="player">{Games.currentPlayer(game).name}</div>
      <TableView game={game} onMove={onMove} />
    </div>
  )
}

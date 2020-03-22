import { pipe } from "fp-ts/lib/pipeable"
import * as R from "ramda"
import { buildEnvironment } from "../Environment/domain"
import { Environment, Notifier } from "../Environment/model"
import * as MCTS from "../monte-carlo-tree-search/mcts"
import * as Games from "../Game/domain"
import * as Cards from "../Cards/domain"
import * as Players from "../Players/domain"
import * as Decks from "../Deck/domain"
import { GameStage, Game } from "../Game/model"
import { Player } from "../Players/model"
import { findMinimalDeadwood } from "../Game/melds"
import { Move } from "../Moves/model"
import { fold } from "fp-ts/lib/Either"
import { Deck } from "../Deck/model"
import { actionOf } from "../utils/actions"

export enum PlayerTypes {
  Human = "Human",
  Random = "Random",
  MCTS = "MCTS",
}

const defaultOptions = {
  timeLimitMs: 500,
}

export const notify: Notifier = (type, data) => game => {
  const d = {
    type,
    data,
    game: {
      ...game,
      deck: Cards.toSymbols(game.deck.cards),
      discardPile: Cards.toSymbols(game.discardPile),
      players: game.players.map(p => ({
        ...p,
        hand: Cards.toSymbols(R.sort(Cards.orderByFaceValue, p.hand)),
      })),
      events: undefined,
    },
  }
  console.log(JSON.stringify(d, null, 2))
  return actionOf(game)
}

const environment: Environment = buildEnvironment({})

const calcScore = (player: Player) => {
  const { deadwood, deadwoodValue } = findMinimalDeadwood(player.hand)
  const value =
    deadwood.length === 0 && player.hand.length === 11
      ? 31
      : deadwood.length === 0 && player.hand.length === 10
      ? 25
      : -deadwoodValue

  const score = (value + 100) / 131

  // console.log("SCORE", Cards.toSymbols(player.hand), score)

  return score
}

const calcScores = (game: Game) => game.players.map(calcScore)

const isFinal = (game: Game) => game.stage === GameStage.Ended

const nextState = (game: Game, move: Move) =>
  pipe(
    Games.run(environment)(game)(Games.play(Games.currentPlayer(game).id, move)),
    fold(_ => game, R.identity),
  )

const gameRules: MCTS.GameRules<Game, Move> = {
  availableMoves: Games.validMoves,
  currentPlayerIndex: state => state.currentPlayerIndex,
  isFinal,
  nextState,
  playersCount: state => state.playersCount,
}

const config: MCTS.Config<Game, Move> = {
  calcScores,
  calcUct: MCTS.defaultUctFormula(),
  gameRules,
}

export const buildGameForSimulation = (shuffle: (deck: Deck) => Deck) => (game: Game, player: Player) => {
  const { minFaceValue, maxFaceValue } = game.deckInfo
  const knownCards = [...game.discardPile, ...player.hand]
  const deckCards = shuffle(Decks.create(minFaceValue, maxFaceValue)).cards.filter(Cards.notIn(knownCards))
  const otherPlayers = R.range(0, game.playersCount - 1).map(i =>
    Players.create(`p${i + 2}`, `Player ${i + 2}`, PlayerTypes.MCTS),
  )
  const distributed = Decks.distributeCards(deckCards, otherPlayers, game.countOfCardsInHand)
  const players = [player, ...distributed.players]
  const deck = Decks.fromCards(distributed.cards, minFaceValue, maxFaceValue)

  // console.log("FC=====>\n", Cards.toSymbols(Decks.create(minFaceValue, maxFaceValue).cards))
  // console.log("KNOWN=====>\n", Cards.toSymbols(knownCards))
  // console.log("DC=====>\n", Cards.toSymbols(deckCards))
  // console.log("P0H=====>\n", Cards.toSymbols(players[0].hand))
  // console.log("P1H=====>\n", Cards.toSymbols(players[1].hand))
  // console.log("DECK=====>\n", Cards.toSymbols(distributed.cards))

  return {
    ...game,
    events: [],
    deck,
    players,
  }
}

export const notifier = (notification: MCTS.Notification) =>
  console.log(
    JSON.stringify(
      {
        ...notification,
        node: {
          ...notification.node,
          state: undefined,
        },
      },
      null,
      2,
    ),
  )
  
const simulateGame = (currentGame: Game, player: Player, options: MCTS.Options) => {
  const gameForSimulation = buildGameForSimulation(Decks.shuffle)(currentGame, player)
  const tree = MCTS.createTree({ ...config })(gameForSimulation, gameForSimulation.currentPlayerIndex)

  const result = MCTS.findBestNode(tree, options)
  // console.log("RESULT: ", JSON.stringify(result.iterationCount, null, 2))
  const { bestNode } = result

  return bestNode.move as Move
}

export const findBestMove = (
  game: Game,
  player: Player,
  options: MCTS.Options = defaultOptions,
): Move => {
  const moves = Games.validMovesForPlayer(player)(game)

  const bestMove = moves.length === 1 ? moves[0] : simulateGame(game, player, options)

  // console.log(JSON.stringify(bestMove, null, 2))

  return bestMove
}

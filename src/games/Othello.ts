import { getKeyEnumByVal } from '../libs/tools'
import { GameBase } from '../modules/GameBase'
import { Player } from '../modules/Player'

export enum Chips {
  EMPTY,
  WHITE,
  BLACK
}

export type Turns = Chips.BLACK | Chips.WHITE
export type OthelloMovement = [x: number, y: number]
export type Board = Chips[][]

export interface OthelloPlayerState {
  chip: Turns
  totalChips: number
  winner: boolean | null
  chipsCoords: [x: number, y: number][]
}

export type OthelloPlayer = Player<OthelloPlayerState>

export interface OthelloState {
  board: Board
  turn: Turns
  winner: Player<OthelloPlayerState> | null
  moves: OthelloMovement[]
  players: Player<OthelloPlayerState>[]
}

export class Othello extends GameBase<
  OthelloState,
  Turns,
  OthelloPlayerState,
  OthelloMovement
> {
  players: Player<OthelloPlayerState>[] = []
  player?: Player<OthelloPlayerState>
  turn: Turns
  winner: Player<OthelloPlayerState> | null
  online: boolean = false
  moves: OthelloMovement[]

  #board: Board

  #directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ]

  constructor(player?: OthelloPlayer, gameState?: OthelloState) {
    super()

    this.player = player

    if (gameState) {
      this.#board = gameState.board
      this.players = gameState.players
      this.turn = gameState.turn
      this.winner = gameState.winner
      this.moves = gameState.moves
    } else {
      this.#board = Array.from({ length: 8 }, () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Array.from({ length: 8 }, () => Chips.EMPTY)
      )
      this.turn = Chips.BLACK
      this.winner = null
      this.moves = []

      this.#board[3][3] = Chips.WHITE
      this.#board[3][4] = Chips.BLACK
      this.#board[4][3] = Chips.BLACK
      this.#board[4][4] = Chips.WHITE
    }

    this.state = {
      board: this.#board,
      turn: this.turn,
      winner: this.winner,
      moves: this.moves,
      players: this.players
    }
  }

  get board(): Board {
    return this.#board
  }

  validateMove([x, y]: OthelloMovement, turn = this.turn): boolean {
    return this.getBeetweenChips([x, y], turn).length > 0
  }

  getBeetweenChips(
    [x, y]: OthelloMovement,
    turn = this.turn
  ): OthelloMovement[] {
    const result: OthelloMovement[] = []

    if (this.#board[x][y] !== Chips.EMPTY) return result

    for (const [dx, dy] of this.#directions) {
      let foundOpponent = false
      let i = x + dx
      let j = y + dy

      while (i >= 0 && i < 8 && j >= 0 && j < 8) {
        const _value = this.#board[i][j]

        if (_value === Chips.EMPTY) break

        if (_value === turn) {
          if (foundOpponent) {
            while (i !== x || j !== y) {
              i -= dx
              j -= dy
              result.push([i, j])
            }
          }

          break
        }

        foundOpponent = true
        i += dx
        j += dy
      }
    }

    return result
  }

  toggleChip([x, y]: OthelloMovement): void {
    console.log(x, y, this.#board[x][y])
    this.#board[x][y] = this.turn

    console.log(x, y, this.#board[x][y], this.state.board[x][y])
  }

  toggleTurn(): void {
    const next = this.turn === Chips.BLACK ? Chips.WHITE : Chips.BLACK

    if (this.hasValidMovements(next)) this.turn = next
    else {
      console.log(`No valid movements for ${next}`)
    }

    console.log(getKeyEnumByVal(Chips, this.turn))
  }

  hasValidMovements(nextTurn: Turns): boolean {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          this.#board[i][j] === Chips.EMPTY &&
          this.validateMove([i, j], nextTurn)
        ) {
          return true
        }
      }
    }

    return false
  }

  makeMove([x, y]: OthelloMovement): Board {
    const movements: OthelloMovement[] = [
      [x, y],
      ...this.getBeetweenChips([x, y])
    ]

    if (movements.length < 2) return this.#board

    for (const movement of movements) {
      this.toggleChip(movement)
    }

    this.toggleTurn()

    return this.#board
  }
}

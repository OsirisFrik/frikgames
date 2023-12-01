/* eslint-disable brace-style */
import { EventEmitter } from 'events'
import { Player } from './Player'

export abstract class GameBaseProperties<
  GameState,
  Turn,
  PlayerState,
  Movement
> extends EventEmitter {
  abstract player?: Player<PlayerState>
  abstract players: Player<PlayerState>[]
  abstract turn: Turn
  abstract winner: Player<PlayerState> | null
  abstract online: boolean
  abstract moves: Movement[]

  abstract validateMove(movement: Movement, turn: Turn): boolean
  abstract hasValidMovements(nextTurn: Turn): boolean
  abstract makeMove(movement: Movement): any
}

export interface GameBaseEvents<GS> {
  on(event: 'state_change', handler: (state: GS) => void): this
}

export abstract class GameBase<
    GameState,
    Turn = any,
    PlayerState = unknown,
    Movement = unknown
  >
  extends GameBaseProperties<GameState, Turn, PlayerState, Movement>
  implements GameBaseEvents<GameState>
{
  #state?: GameState

  get state(): GameState {
    return this.#state!
  }

  set state(state: GameState) {
    this.#state = state
    this.emit('state_change', state)
  }
}

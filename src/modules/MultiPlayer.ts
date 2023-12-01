/* eslint-disable brace-style */
import { Socket, io } from 'socket.io-client'
import { Player, PlayerData } from './Player'
import EventEmitter from 'events'

export interface EmitEvents<GameState = any, Movement = any, PlayerState = any>
  extends ListenEvents<GameState, Movement, PlayerState> {
  room_join: (
    room: string,
    player: PlayerData<PlayerState>,
    gameState?: GameState
  ) => void
  room_leave: (room: string) => void
  start_game: () => void
  game_end: () => void
  restart_game: () => void
  player_move: (movement: Movement) => void
}

export interface ListenEvents<G = any, M = any, P = any> {
  room_joined: (room: string, gameState: G) => void
  room_full: (room: string, config?: G) => void
  player_join: (player: PlayerData<P>, room: G) => void
  player_leave: (player: PlayerData<P>) => void
  player_move: (movement: M) => void
  sync_game: (game: G) => void
  start_game: (game: G) => void
  set_owner: (player: PlayerData<P>) => void
}

export interface MultiplayerEvents<GameState, GameMovement, PlayerGameState>
  extends EventEmitter {
  on(ev: 'connect', handler: () => void): this
}

export class Multiplayer<
    GameState,
    GameMovement,
    PlayerState,
    GameListenEevents extends ListenEvents<
      GameState,
      GameMovement,
      PlayerState
    > = ListenEvents<GameState, GameMovement, PlayerState>,
    GameEmitEvents extends EmitEvents<
      GameState,
      GameMovement,
      PlayerState
    > = EmitEvents<GameState, GameMovement, PlayerState>
  >
  extends EventEmitter
  implements MultiplayerEvents<GameState, GameMovement, PlayerState>
{
  #room: string
  #socket: Socket<GameListenEevents, GameEmitEvents>

  player: Player<PlayerState>

  constructor(
    host: string,
    room: string,
    player: PlayerData<PlayerState>,
    gameState: GameState,
    autoConnect = false
  ) {
    super()

    this.#socket = io(host, { autoConnect })
    this.#room = room
    this.player = new Player(player)

    this.#socket.on('connect', this.#onConnect.bind(this, room))
  }

  connect() {
    this.#socket.connect()
  }

  #onConnect(room: string): void {
    console.log('connected')
    this.#joinToRoom(room)
  }

  #joinToRoom(room: string): void {
    this.#socket.send('room_join', room, this.player, {})
  }
}

export interface PlayerData<PlayerState = unknown> {
  id: string
  nickname?: string | null
  playerState?: PlayerState
}

interface PlayerConstructor<PlayerState> extends PlayerData<PlayerState> {
  isOwner?: boolean
}

export class Player<PlayerState = unknown> implements PlayerData<PlayerState> {
  id: string
  nickname?: string | null
  playerState?: PlayerState
  isOwner: boolean

  constructor({
    id,
    nickname,
    playerState,
    isOwner = false
  }: PlayerConstructor<PlayerState>) {
    this.id = id
    this.nickname = nickname
    this.playerState = playerState
    this.isOwner = isOwner
  }
}

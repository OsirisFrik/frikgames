import ReadLine from 'readline'
import { Othello } from './games/Othello'
import { Multiplayer } from './modules/MultiPlayer'
import { Player } from './modules/Player'

const game = new Othello()
const player = new Player({
  id: '1',
  nickname: 'Player 1',
  playerState: {},
  isOwner: true
})
const rline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
})
const multiplayer = new Multiplayer(
  'http://localhost:3003',
  'othello',
  player,
  game.state,
  true
)

function loadScreen() {
  console.table(game.state.board)
}

function movement(): void {
  rline.question('Enter a movement (X,Y): ', (input) => {
    const [x, y] = input.split(',').map(Number)

    if (isNaN(x) || isNaN(y)) {
      console.log('Invalid input')
    } else if (game.validateMove([x, y])) {
      game.makeMove([x, y])
    } else {
      console.log('Invalid movement')
    }

    loadScreen()

    return movement()
  })
}

loadScreen()
movement()

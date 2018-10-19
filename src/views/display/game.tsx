import React, { Component } from "react"
import io from "socket.io-client"
import css from "styled-jsx/css"
import { commands } from "../../commands"
import { JoinHelpBar } from "../../components/join-help-bar"

const COLS = 10
const ROWS = 20
const board: number[][] = []
let lose: boolean
let interval: number
let intervalRender: number
let current: number[][] // current moving shape
let currentX: number
let currentY: number // position of current shape
let freezed: boolean // is current shape settled on the board?
const shapes = [
  [1, 1, 1, 1],
  [1, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 1, 1],
  [0, 1, 0, 0, 1, 1, 1],
]
const colors = [
  "#2ecc71",
  "#34495e",
  "#9b59b6",
  "#f1c40f",
  "#e74c3c",
  "#e67e22",
  "#1abc9c",
]
const W = 450
const H = 900
const BLOCK_W = W / COLS
const BLOCK_H = H / ROWS

interface DisplayGameProps {
  score: number
  socket: typeof io.Socket
  addToScore: (score: number) => void
  onGameOver: () => void
  resetScore: () => void
}

interface DisplayGameState {
  context: CanvasRenderingContext2D | null
}

export class Game extends Component<DisplayGameProps, DisplayGameState> {
  canvasRef: React.RefObject<HTMLCanvasElement>

  constructor(props: DisplayGameProps) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = {
      context: null,
    }
  }

  componentDidMount() {
    this.setState({ context: this.canvasRef.current!.getContext("2d") })
    this.props.socket.on("gameCommand", this.handleCommand)
    this.newGame()
  }

  componentWillUnmount() {
    this.props.socket.removeListener("gameCommand", this.handleCommand)
  }

  handleCommand = (command: string) => {
    switch (command) {
      case commands.COMMAND_LEFT:
        if (this.valid(-1)) {
          --currentX
        }
        break
      case commands.COMMAND_RIGHT:
        if (this.valid(1)) {
          ++currentX
        }
        break
      case commands.COMMAND_DOWN:
        if (this.valid(0, 1)) {
          ++currentY
        }
        break
      case commands.COMMAND_ROTATE:
        const rotated = this.rotate()
        if (this.valid(0, 0, rotated)) {
          current = rotated
        }
        break
      case commands.COMMAND_DROP:
        while (this.valid(0, 1)) {
          ++currentY
        }
        this.tick()
        break
    }
    this.render()
  }

  // START TETRIS FUNCTIONS

  // creates a new 4x4 shape in global variable 'current'
  // 4x4 so as to cover the size when the shape is rotated
  newShape = () => {
    const id = Math.floor(Math.random() * shapes.length)
    const shape = shapes[id] // maintain id for color filling

    current = []
    for (let y = 0; y < 4; ++y) {
      current[y] = []
      for (let x = 0; x < 4; ++x) {
        const i = 4 * y + x
        if (typeof shape[i] !== "undefined" && shape[i]) {
          current[y][x] = id + 1
        } else {
          current[y][x] = 0
        }
      }
    }

    // new shape starts to move
    freezed = false
    // position where the shape will evolve
    currentX = 5
    currentY = 0
  }

  // clears the board
  init = () => {
    for (let y = 0; y < ROWS; ++y) {
      board[y] = []
      for (let x = 0; x < COLS; ++x) {
        board[y][x] = 0
      }
    }
  }

  // keep the element moving down, creating new shapes and clearing lines
  tick = () => {
    if (this.valid(0, 1)) {
      ++currentY
    } else {
      // if the element settled
      this.freeze()
      this.valid(0, 1)
      this.clearLines()
      if (lose) {
        this.clearAllIntervals()
        return false
      }
      this.newShape()
    }
  }

  // stop shape at its position and fix it to board
  freeze = () => {
    for (let y = 0; y < 4; ++y) {
      for (let x = 0; x < 4; ++x) {
        if (current[y][x]) {
          board[y + currentY][x + currentX] = current[y][x]
        }
      }
    }
    freezed = true
    this.props.addToScore(10)
  }

  // returns rotates the rotated shape 'current' perpendicularly anticlockwise
  rotate = () => {
    const newCurrent: number[][] = []
    for (let y = 0; y < 4; ++y) {
      newCurrent[y] = []
      for (let x = 0; x < 4; ++x) {
        newCurrent[y][x] = current[3 - x][y]
      }
    }

    return newCurrent
  }

  // check if any lines are filled and clear them
  clearLines = () => {
    for (let y = ROWS - 1; y >= 0; --y) {
      let rowFilled = true
      for (let x = 0; x < COLS; ++x) {
        if (board[y][x] === 0) {
          rowFilled = false
          break
        }
      }
      if (rowFilled) {
        for (let yy = y; yy > 0; --yy) {
          for (let x = 0; x < COLS; ++x) {
            board[yy][x] = board[yy - 1][x]
          }
        }
        ++y
      }
    }
  }

  // checks if the resulting position of current shape will be feasible
  valid = (offsetX = 0, offsetY = 0, newCurrent = current) => {
    offsetX = currentX + offsetX
    offsetY = currentY + offsetY

    for (let y = 0; y < 4; ++y) {
      for (let x = 0; x < 4; ++x) {
        if (newCurrent[y][x]) {
          if (
            typeof board[y + offsetY] === "undefined" ||
            typeof board[y + offsetY][x + offsetX] === "undefined" ||
            board[y + offsetY][x + offsetX] ||
            x + offsetX < 0 ||
            y + offsetY >= ROWS ||
            x + offsetX >= COLS
          ) {
            if (offsetY === 1 && freezed) {
              lose = true
              this.props.onGameOver()
            }
            return false
          }
        }
      }
    }
    return true
  }

  newGame = () => {
    this.props.resetScore()
    this.clearAllIntervals()
    intervalRender = window.setInterval(this.renderTetris, 30)
    this.init()
    this.newShape()
    lose = false
    interval = window.setInterval(this.tick, 500)
  }

  clearAllIntervals = () => {
    clearInterval(interval)
    clearInterval(intervalRender)
  }

  // draw a single square at (x, y)
  drawBlock = (x: number, y: number) => {
    this.state.context!.fillRect(
      BLOCK_W * x,
      BLOCK_H * y,
      BLOCK_W - 1,
      BLOCK_H - 1,
    )
    this.state.context!.strokeRect(
      BLOCK_W * x,
      BLOCK_H * y,
      BLOCK_W - 1,
      BLOCK_H - 1,
    )
  }

  // draws the board and the moving shape
  renderTetris = () => {
    this.state.context!.clearRect(0, 0, W, H)

    this.state.context!.strokeStyle = "black"
    for (let x = 0; x < COLS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        if (board[y][x]) {
          this.state.context!.fillStyle = colors[board[y][x] - 1]
          this.drawBlock(x, y)
        }
      }
    }

    this.state.context!.fillStyle = "red"
    this.state.context!.strokeStyle = "black"
    for (let y = 0; y < 4; ++y) {
      for (let x = 0; x < 4; ++x) {
        if (current[y][x]) {
          this.state.context!.fillStyle = colors[current[y][x] - 1]
          this.drawBlock(currentX + x, currentY + y)
        }
      }
    }
  }

  // END TETRIS FUNCTIONS

  render() {
    const { score } = this.props

    const { className, styles } = css.resolve`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    `

    return (
      <div className="wrap">
        <canvas width={W} height={H} ref={this.canvasRef} />
        <h1>Score: {score}</h1>
        <JoinHelpBar className={className} />
        {styles}
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100vh;
            display: flex;
            text-align: center;
            justify-content: center;
            align-items: flex-start;
          }

          canvas {
            outline: 2px solid black;
            display: block;
          }

          h1 {
            position: absolute;
            top: 1vw;
            right: 1vw;
          }
        `}</style>
      </div>
    )
  }
}

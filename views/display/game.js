import { Component } from 'react'
import { LEFT, RIGHT, DOWN, DROP, ROTATE } from '../../lib/commands'
import JoinHelpBar from '../../components/joinHelpBar'
import css from 'styled-jsx/css'

const COLS = 10
const ROWS = 20
let board = []
let lose
let interval
let intervalRender
let current // current moving shape
let currentX
let currentY // position of current shape
let freezed // is current shape settled on the board?
const shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];
const colors = [
  '#2ecc71', '#34495e', '#9b59b6', '#f1c40f', '#e74c3c', '#e67e22', '#1abc9c'
]
const W = 300
const H = 600
const BLOCK_W = W / COLS
const BLOCK_H = H / ROWS

export default class DisplayGame extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      context: null
    }
  }

  addListenerOnce(name, callback) {
    this.props.socket.off(name);
    this.props.socket.on(name, callback);
  }
  
  componentDidMount () {
    this.setState({ context: this.canvasRef.current.getContext('2d') })
    this.addListenerOnce('commands', this.handleCommand)
    this.newGame()
  }

  componentDidUpdate () {
    this.addListenerOnce('commands', this.handleCommand)
  }
  
  handleCommand = (command) => {
    switch ( command.value ) {
      case LEFT:
        if ( this.valid( -1 ) ) {
          --currentX;
        }
        break;
      case RIGHT:
        if ( this.valid( 1 ) ) {
           ++currentX;
        }
        break;
      case DOWN:
        if ( this.valid( 0, 1 ) ) {
          ++currentY;
        }
        break;
      case ROTATE:
        const rotated = this.rotate( current );
        if ( this.valid( 0, 0, rotated ) ) {
          current = rotated;
        }
        break;
      case DROP:
        while( this.valid(0, 1) ) {
          ++currentY;
        }
        this.tick();
        break;
    }
    this.render();
  }


  // START TETRIS FUNCTIONS

  // creates a new 4x4 shape in global variable 'current'
  // 4x4 so as to cover the size when the shape is rotated
  newShape = () => {
    let id = Math.floor( Math.random() * shapes.length );
    let shape = shapes[ id ]; // maintain id for color filling

    current = [];
    for ( let y = 0; y < 4; ++y ) {
      current[ y ] = [];
      for ( let x = 0; x < 4; ++x ) {
        const i = 4 * y + x;
        if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
          current[ y ][ x ] = id + 1;
        }
        else {
          current[ y ][ x ] = 0;
        }
      }
    }
    
    // new shape starts to move
    freezed = false;
    // position where the shape will evolve
    currentX = 5;
    currentY = 0;
  }

  // clears the board
  init = () => {
    for ( let y = 0; y < ROWS; ++y ) {
      board[ y ] = [];
      for ( let x = 0; x < COLS; ++x ) {
        board[ y ][ x ] = 0;
      }
    }
  }

  // keep the element moving down, creating new shapes and clearing lines
  tick = () => {
    if ( this.valid( 0, 1 ) ) {
        ++currentY;
    }
    // if the element settled
    else {
      this.freeze();
      this.valid(0, 1);
      this.clearLines();
      if (lose) {
        this.clearAllIntervals();
        return false;
      }
      this.newShape();
    }
  }

  // stop shape at its position and fix it to board
  freeze = () => {
    for ( let y = 0; y < 4; ++y ) {
      for ( let x = 0; x < 4; ++x ) {
        if ( current[ y ][ x ] ) {
          board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
        }
      }
    }
    freezed = true;
    this.props.addToScore(10)
  }

  // returns rotates the rotated shape 'current' perpendicularly anticlockwise
  rotate = current => {
    let newCurrent = [];
    for ( let y = 0; y < 4; ++y ) {
      newCurrent[ y ] = [];
      for ( let x = 0; x < 4; ++x ) {
        newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
      }
    }

    return newCurrent;
  }

  // check if any lines are filled and clear them
  clearLines = () => {
    for ( let y = ROWS - 1; y >= 0; --y ) {
      let rowFilled = true;
      for ( let x = 0; x < COLS; ++x ) {
        if ( board[ y ][ x ] == 0 ) {
          rowFilled = false;
          break;
        }
      }
      if ( rowFilled ) {
        for ( let yy = y; yy > 0; --yy ) {
          for ( let x = 0; x < COLS; ++x ) {
            board[ yy ][ x ] = board[ yy - 1 ][ x ];
          }
        }
        ++y;
      }
    }
  }

  // checks if the resulting position of current shape will be feasible
  valid = ( offsetX, offsetY, newCurrent ) => {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for ( let y = 0; y < 4; ++y ) {
      for ( let x = 0; x < 4; ++x ) {
        if ( newCurrent[ y ][ x ] ) {
          if (
            typeof board[ y + offsetY ] == 'undefined'
            || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
            || board[ y + offsetY ][ x + offsetX ]
            || x + offsetX < 0
            || y + offsetY >= ROWS
            || x + offsetX >= COLS
          ) {
            if (offsetY == 1 && freezed) {
              lose = true; // lose if the current shape is settled at the top most row
            }
            return false;
          }
        }
      }
    }
    return true;
  }

  newGame = () => {
    this.props.resetScore()
    this.clearAllIntervals();
    intervalRender = setInterval( this.renderTetris, 30 );
    this.init();
    this.newShape();
    lose = false;
    interval = setInterval( this.tick, 1000 );
  }

  clearAllIntervals = () => {
    clearInterval( interval );
    clearInterval( intervalRender );
  }

  // draw a single square at (x, y)
  drawBlock = (x, y) => {
    this.state.context.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    this.state.context.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  }

  // draws the board and the moving shape
  renderTetris = () => {
    this.state.context.clearRect( 0, 0, W, H );

    this.state.context.strokeStyle = 'black';
    for ( let x = 0; x < COLS; ++x ) {
      for ( let y = 0; y < ROWS; ++y ) {
        if ( board[ y ][ x ] ) {
          this.state.context.fillStyle = colors[ board[ y ][ x ] - 1 ];
          this.drawBlock( x, y );
        }
      }
    }

    this.state.context.fillStyle = 'red';
    this.state.context.strokeStyle = 'black';
    for ( let y = 0; y < 4; ++y ) {
      for ( let x = 0; x < 4; ++x ) {
        if ( current[ y ][ x ] ) {
          this.state.context.fillStyle = colors[ current[ y ][ x ] - 1 ];
          this.drawBlock( currentX + x, currentY + y );
        }
      }
    }
  }

  // END TETRIS FUNCTIONS

  render () {
    let { score } = this.props

    const { className, styles } = css.resolve`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    `

    return (
      <div className='wrap'>
        <canvas width='300' height='600' ref={this.canvasRef} />
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
            align-items: center;
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

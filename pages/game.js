import { Component } from 'react'
import { LEFT, RIGHT, DOWN, DROP, ROTATE } from '../lib/commands'

var COLS = 10
var ROWS = 20
var board = []
var lose
var interval
var intervalRender
var current // current moving shape
var currentX
var currentY // position of current shape
var freezed // is current shape settled on the board?
var shapes = [
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
var colors = [
  'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
]
var W = 300
var H = 600
var BLOCK_W = W / COLS
var BLOCK_H = H / ROWS

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      commands: [],
      subscribe: false,
      subscribed: false,
      context: null
    }
  }

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      this.props.socket.on('commands', this.handleCommand)
      this.setState({ subscribed: true })
    }
  }
  
  componentDidMount () {
    this.setState({ context: this.canvasRef.current.getContext('2d') })
    this.subscribe()
    this.newGame()
  }

  componentDidUpdate () {
    this.subscribe()
  }

  static getDerivedStateFromProps (props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true }
    return null
  }

  componentWillUnmount () {
    this.props.socket.off('commands', this.handleCommand)
  }

  handleCommand = (command) => {
    console.log(command.value)
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
        var rotated = this.rotate( current );
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
    this.setState(state => ({ commands: state.commands.concat([command]) }))
  }


  // START TETRIS FUNCTIONS

  // creates a new 4x4 shape in global variable 'current'
  // 4x4 so as to cover the size when the shape is rotated
  newShape = () => {
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[ id ]; // maintain id for color filling

    current = [];
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
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
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
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
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
    freezed = true;
  }

  // returns rotates the rotated shape 'current' perpendicularly anticlockwise
  rotate = current => {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }

    return newCurrent;
  }

  // check if any lines are filled and clear them
  clearLines = () => {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            //document.getElementById( 'clearsound' ).play();
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
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

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
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
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                this.state.context.fillStyle = colors[ board[ y ][ x ] - 1 ];
                this.drawBlock( x, y );
            }
        }
    }

    this.state.context.fillStyle = 'red';
    this.state.context.strokeStyle = 'black';
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                this.state.context.fillStyle = colors[ current[ y ][ x ] - 1 ];
                this.drawBlock( currentX + x, currentY + y );
            }
        }
    }
  }

  // END TETRIS FUNCTIONS

  render () {
    return (
      <canvas width='300' height='600' ref={this.canvasRef} style={{outline: '2px solid black', margin:'24px auto', display: 'block'}} />
    )
  }
}

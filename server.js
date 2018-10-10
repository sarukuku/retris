const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()


// TODO: Fix lib/views export
const DISPLAY_WAITING = 'DISPLAY_WAITING'
const DISPLAY_GAME = 'DISPLAY_GAME'
const DISPLAY_WAITING_TO_START = 'DISPLAY_WAITING_TO_START'
const DISPALY_GAME_OVER = 'DISPALY_GAME_OVER'

let hostId;

const db = {
  queue: [],
  currentPlayerId: null
}

const clone = obj => JSON.parse(JSON.stringify(obj));

const sendGameState = socket => {
  // Use 'socket' param when sending the state to the single socket only.
  const state = clone(db);
  state.gameRunning = Boolean(hostId);
  if (socket) socket.emit('gameState', JSON.stringify(state));
  else io.emit('gameState', JSON.stringify(state));
}

const joinGame = socket => {
  if (db.queue.indexOf(socket.id) === -1) { // There apperars to be a slight change that joinGame triggers twice
    if (db.queue.length === 0) db.currentPlayerId = socket.id;
    db.queue.push(socket.id);
    sendGameState();
    socket.emit('gameJoined', socket.id);
  }
}

const removeIdFromQueue = removeId => db.queue = db.queue.filter(id => id !== removeId);

const leaveGame = id => {
  removeIdFromQueue(id);
  if (id === db.currentPlayerId) {
    db.currentPlayerId = db.queue[0];
  }
  if (id === hostId) hostId = null;
  sendGameState();
}

const sendToHost = (command, data) => {
  io.to(hostId).emit(command, data);
}

io.on('connection', socket => {
  sendGameState(socket);

  socket.on('joinGame', () => {
    joinGame(socket)
  });

  socket.on('createGame', () => {
    hostId = socket.id;
    sendGameState();
  })

  socket.on('commands', data => {
    sendToHost('commands', data);
  });

  socket.on('gameOver', () => {
    if (socket.id === hostId) {
      leaveGame(db.currentPlayerId);
      const goToView = (!db.currentPlayerId && !db.queue.length)
        ? DISPLAY_WAITING
        : DISPLAY_WAITING_TO_START;
      const data = {
        queueLength: db.queue.length,
        goToView: goToView
      }
      sendToHost('hostState', JSON.stringify(data));
    }
  });

  socket.on('start', () => {
    console.log('start')
  });

  socket.on('disconnect', () => {
    leaveGame(socket.id);
  });
});

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

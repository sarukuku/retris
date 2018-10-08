const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const db = {
  queue: [],
  currentPlayerId: null
}

const queueIsEmpty = () => db.queue.length === 0;

const sendGameState = () => {
  io. emit('gameState', JSON.stringify(db));
}

const joinGame = socket => {
  if (queueIsEmpty()) db.currentPlayerId = socket.id;
  db.queue.push(socket.id);
  sendGameState(socket);
  socket.emit('gameJoined', socket.id);
}

const removeIdFromQueue = removeId => db.queue = db.queue.filter(id => id !== removeId);

const leaveGame = socket => {
  removeIdFromQueue(socket.id);
  if (socket.id === db.currentPlayerId) {
    db.currentPlayerId = db.queue[0];
  }
  sendGameState(socket);
}

io.on('connection', socket => {
  socket.on('joinGame', () => {
    joinGame(socket)
  });

  socket.on('commands', data => {
    socket.broadcast.emit('commands', data);
  });

  socket.on('start', () => {
    console.log('start')
  });

  socket.on('disconnect', () => {
    leaveGame(socket);
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

const app = require("express")()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const next = require("next")

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const R = require("ramda")
const views = require("./lib/views")
const commands = require("./lib/commands")

// Controller groups
const QUEUE_GROUP = "QUEUE_GROUP"

let serverState = {
  displays: [],
  controllers: [],
  activeController: null
}

// Sent to all displays
let displaysState = {
  activeView: views.DISPLAY_WAITING,
  queueLength: 0
}

// Sent to all controllers except the active one
let controllersState = {
  activeView: views.CONTROLLER_JOIN,
  queueLength: 0
}

// Sent only to the active controller
let activeControllerState = {
  activeView: views.CONTROLLER_START,
  queueLength: 0
}

/**
 * Handle commands related to displays
 */
let displays = io.of("/display")
displays.on("connect", display => {
  // Add a display to a list when it joins
  display.on(commands.COMMAND_DISPLAY_JOIN, () => {
    if (!R.contains(display, serverState.displays)) {
      serverState.displays = R.append(display, serverState.displays)
    }

    // Update display state after join
    display.emit(displaysState)
  })

  display.on(commands.COMMAND_GAME_OVER, () => {
    // Update active controller
    activeControllerState.queueLength = serverState.controllers.length
    activeControllerState.activeView = views.CONTROLLER_GAME_OVER
    serverState.activeController.emit("command", activeControllerState)

    // Wait a bit before navigating away from the game over screen
    setTimeout(() => {
      // Update displays
      displaysState.queueLength = serverState.controllers.length
      if (serverState.controllers.length > 0) {
        displaysState.activeView = views.DISPLAY_WAITING_TO_START
      } else {
        displaysState.activeView = views.DISPLAY_WAITING
      }
      displays.emit("command", displaysState)

      // Update active controller
      activeControllerState.queueLength = serverState.controllers.length
      activeControllerState.activeView = views.CONTROLLER_JOIN
      serverState.activeController.emit("command", activeControllerState)

      // Pick new active controller
      if (serverState.controllers.length > 0) {
        serverState.activeController = serverState.controllers.shift()
        serverState.activeController.leave(QUEUE_GROUP)

        // Change the view of the active controller to confirm start
        activeControllerState.queueLength = serverState.controllers.length
        activeControllerState.activeView = views.CONTROLLER_START
        serverState.activeController.emit("command", activeControllerState)

        // Update other controllers
        controllersState.activeView = views.CONTROLLER_IN_QUEUE
        controllersState.queueLength = serverState.controllers.length
        controllers.to(QUEUE_GROUP).emit("command", controllersState)
      } else {
        // Set active controller to empty
        serverState.activeController = null
      }
    }, 4000)
  })

  // Remove a display from the queue if it's lost
  display.on("disconnect", () => {
    serverState.displays = serverState.displays.filter(e => e !== display)
  })
})

/**
 * Handle commands related to controllers
 */
let controllers = io.of("/controller")
controllers.on("connect", controller => {
  // Add controller to controller queue when it joins (if it's not already there)
  controller.on(commands.COMMAND_CONTROLLER_JOIN, () => {
    if (!R.contains(controller, serverState.controllers)) {
      serverState.controllers = R.append(controller, serverState.controllers)
      controller.join(QUEUE_GROUP)
    }

    // Update controller state after join
    controllersState.activeView = views.CONTROLLER_IN_QUEUE
    controllersState.queueLength = serverState.controllers.length
    controller.emit("command", controllersState)

    // Update displays when a controller joins
    if (serverState.activeController === null) {
      // Update displays
      displaysState.queueLength = serverState.controllers.length
      displaysState.activeView = views.DISPLAY_WAITING_TO_START
      displays.emit("command", displaysState)

      // If we don't have a current player and someone just joined
      // lets make the first one in the queue the active player
      serverState.activeController = serverState.controllers.shift()
      serverState.activeController.leave(QUEUE_GROUP)
      activeControllerState.queueLength = serverState.controllers.length
      activeControllerState.activeView = views.CONTROLLER_START
      serverState.activeController.emit("command", activeControllerState)
    } else {
      controllersState.queueLength = serverState.controllers.length
      controllersState.activeView = views.CONTROLLER_IN_QUEUE
      controller.emit("command", controllersState)
    }

    // Update other controllers
    controllersState.activeView = views.CONTROLLER_IN_QUEUE
    controllersState.queueLength = serverState.controllers.length
    controllers.to(QUEUE_GROUP).emit("command", controllersState)
  })

  // On game start command
  controller.on(commands.COMMAND_START, () => {
    // Update active controller
    activeControllerState.queueLength = serverState.controllers.length
    activeControllerState.activeView = views.CONTROLLER_GAME_CONTROLS
    serverState.activeController.emit("command", activeControllerState)

    // Update displays
    displaysState.queueLength = serverState.controllers.length
    displaysState.activeView = views.DISPLAY_GAME
    displays.emit("command", displaysState)
  })

  controller.on("gameCommand", command => {
    switch (command) {
      case commands.COMMAND_ROTATE:
        displays.emit("gameCommand", commands.COMMAND_ROTATE)
        break
      case commands.COMMAND_RIGHT:
        displays.emit("gameCommand", commands.COMMAND_RIGHT)
        break
      case commands.COMMAND_DOWN:
        displays.emit("gameCommand", commands.COMMAND_DOWN)
        break
      case commands.COMMAND_LEFT:
        displays.emit("gameCommand", commands.COMMAND_LEFT)
        break
    }
  })

  controller.on("disconnect", () => {
    // Remove a controller from the queue if it's there
    serverState.controllers = serverState.controllers.filter(
      e => e !== controller
    )

    // Remove controller from activeController if it's there
    if (R.equals(serverState.activeController, controller)) {
      // Select a new active controller if possible
      if (serverState.controllers.length > 0) {
        serverState.activeController = serverState.controllers.shift()
        serverState.activeController.leave(QUEUE_GROUP)

        // Change the view of the active controller to confirm start
        activeControllerState.queueLength = serverState.controllers.length
        activeControllerState.activeView = views.CONTROLLER_START
        serverState.activeController.emit("command", activeControllerState)

        // Update displays
        displaysState.queueLength = serverState.controllers.length
        displaysState.activeView = views.DISPLAY_WAITING_TO_START
        displays.emit("command", displaysState)
      } else {
        serverState.activeController = null
        // Update displays
        displaysState.queueLength = serverState.controllers.length
        displaysState.activeView = views.DISPLAY_WAITING
        displays.emit("command", displaysState)
      }
    }

    // Update other controllers
    controllersState.activeView = views.CONTROLLER_IN_QUEUE
    controllersState.queueLength = serverState.controllers.length
    controllers.to(QUEUE_GROUP).emit("command", controllersState)
  })
})

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

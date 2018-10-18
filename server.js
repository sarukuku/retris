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

const serverState = {
  displays: [],
  controllers: [],
  activeController: null
}

// Sent to all displays
const displaysState = {
  activeView: views.DISPLAY_WAITING,
  queueLength: 0
}

// Sent to all controllers except the active one
const controllersState = {
  activeView: views.CONTROLLER_JOIN,
  queueLength: 0
}

// Sent only to the active controller
const activeControllerState = {
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
    updateActiveController(views.CONTROLLER_GAME_OVER)
    updateDisplays(views.DISPLAY_GAME_OVER)
    // Wait a bit before navigating away from the game over screen
    setTimeout(() => {
      const view =
        R.length(serverState.controllers) > 0
          ? views.DISPLAY_WAITING_TO_START
          : views.DISPLAY_WAITING
      updateDisplays(view)
      updateActiveController(views.CONTROLLER_JOIN)

      if (serverState.controllers.length > 0) {
        serverState.activeController = serverState.controllers.shift()
        serverState.activeController.leave(QUEUE_GROUP)
        updateActiveController(views.CONTROLLER_START)
        updateOtherControllers(views.CONTROLLER_IN_QUEUE)
      } else {
        serverState.activeController = null
      }
    }, 5000)
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

    updateCurrentController(controller, views.CONTROLLER_IN_QUEUE)

    if (serverState.activeController === null) {
      updateDisplays(views.DISPLAY_WAITING_TO_START)
      serverState.activeController = serverState.controllers.shift()
      serverState.activeController.leave(QUEUE_GROUP)
      updateActiveController(views.CONTROLLER_START)
    } else {
      updateCurrentController(controller, views.CONTROLLER_IN_QUEUE)
    }

    updateOtherControllers(views.CONTROLLER_IN_QUEUE)
  })

  // On game start command
  controller.on(commands.COMMAND_START, () => {
    updateActiveController(views.CONTROLLER_GAME_CONTROLS)
    updateDisplays(views.DISPLAY_GAME)
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
      if (R.length(serverState.controllers) > 0) {
        serverState.activeController = serverState.controllers.shift()
        serverState.activeController.leave(QUEUE_GROUP)
        updateActiveController(views.CONTROLLER_START)
        updateDisplays(views.DISPLAY_WAITING_TO_START)
      } else {
        serverState.activeController = null
        updateDisplays(views.DISPLAY_WAITING)
      }
    }

    updateOtherControllers(views.CONTROLLER_IN_QUEUE)
  })
})

// Updates all controllers in queue
const updateOtherControllers = view => {
  controllersState.activeView = view
  controllersState.queueLength = serverState.controllers.length
  controllers.to(QUEUE_GROUP).emit("command", controllersState)
}

// Updates all displays
const updateDisplays = view => {
  displaysState.activeView = view
  displaysState.queueLength = serverState.controllers.length
  displays.emit("command", displaysState)
}

// Updates the active controller
const updateActiveController = view => {
  activeControllerState.activeView = view
  activeControllerState.queueLength = serverState.controllers.length
  if (serverState.activeController !== null) {
    serverState.activeController.emit("command", activeControllerState)
  }
}

// Updates the state of the passed controller
const updateCurrentController = (controller, view) => {
  controllersState.queueLength = serverState.controllers.length
  controllersState.activeView = view
  controller.emit("command", controllersState)
}

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

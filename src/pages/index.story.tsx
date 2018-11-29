import { storiesOf } from "@storybook/react"
import React from "react"
import { ReplaySubject } from "rxjs"
import { Analytics } from "../analytics"
import { TranslationContext } from "../components/contexts"
import { withAutoUnsubscribe } from "../components/with-auto-unsubscribe"
import { SocketPayload } from "../components/with-socket"
import { defaultTranslations } from "../i18n/default-translations"
import { createTranslate } from "../i18n/translate"
import { views } from "../views"
import { _Controller } from "./index"

const analyticsStub: Analytics = {
  sendCustomEvent: () => undefined,
  sendPageView: () => undefined,
}

const socket = new ReplaySubject<SocketPayload>()
const Controller = withAutoUnsubscribe(_Controller)

const View = () => {
  return (
    <div style={{ width: "320px", height: "568px", position: "relative" }}>
      <TranslationContext.Provider value={createTranslate(defaultTranslations)}>
        <Controller analytics={analyticsStub} socket={socket} />
      </TranslationContext.Provider>
    </div>
  )
}

storiesOf("Controller", module)
  .add("Start", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.CONTROLLER_START },
    })

    return View()
  })
  .add("In Queue", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.CONTROLLER_IN_QUEUE },
    })

    return View()
  })
  .add("Controls", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.CONTROLLER_GAME_CONTROLS },
    })

    return View()
  })
  .add("Game Over", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.CONTROLLER_GAME_OVER },
    })

    return View()
  })
  .add("Offline", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.CONTROLLER_GAME_OFFLINE },
    })

    return View()
  })

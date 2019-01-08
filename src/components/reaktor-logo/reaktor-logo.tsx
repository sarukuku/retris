import React from "react"
import { clientConfig } from "../../client-config"

export const ReaktorLogo = () => (
  <img
    style={{
      display: "block",
      maxWidth: "100%",
    }}
    src={`${clientConfig.staticPath}/reaktor-logo.png`}
  />
)

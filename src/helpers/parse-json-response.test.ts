import { parseJSONResponse } from "./parse-json-response"

test("text is undefined", async () => {
  const res = { text: async () => undefined }

  const output = await parseJSONResponse(res)

  expect(output).toEqual(undefined)
})

test("text is not JSON", async () => {
  const res = { text: async () => "notAJSON" }

  const output = await parseJSONResponse(res)

  expect(output).toEqual(undefined)
})

test("text is JSON", async () => {
  const json = { foo: "bar" }
  const res = { text: async () => JSON.stringify(json) }

  const output = await parseJSONResponse(res)

  expect(output).toEqual(json)
})

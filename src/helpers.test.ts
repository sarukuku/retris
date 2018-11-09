import { pick, parseJSON } from "./helpers"

describe("pick", () => {
  const originalRandom = Math.random
  afterAll(() => {
    Math.random = originalRandom
  })

  const array = ["a", "b", "c"]

  const tests = [
    {
      randomMock: 0,
      expectedElement: array[0],
    },
    {
      randomMock: 0.32,
      expectedElement: array[0],
    },
    {
      randomMock: 0.34,
      expectedElement: array[1],
    },
    {
      randomMock: 0.65,
      expectedElement: array[1],
    },
    {
      randomMock: 0.67,
      expectedElement: array[2],
    },
    {
      randomMock: 0.99,
      expectedElement: array[2],
    },
  ]

  tests.map(({ randomMock, expectedElement }) =>
    test(`return ${expectedElement} if random returns ${randomMock}`, () => {
      Math.random = () => randomMock
      expect(pick(array)).toBe(expectedElement)
    }),
  )
})

describe("parse JSON", () => {
  test("text is undefined", async () => {
    const res = { text: async () => undefined }

    const output = await parseJSON(res)

    expect(output).toEqual(undefined)
  })

  test("text is not JSON", async () => {
    const res = { text: async () => "notAJSON" }

    const output = await parseJSON(res)

    expect(output).toEqual(undefined)
  })

  test("text is JSON", async () => {
    const json = { foo: "bar" }
    const res = { text: async () => JSON.stringify(json) }

    const output = await parseJSON(res)

    expect(output).toEqual(json)
  })
})

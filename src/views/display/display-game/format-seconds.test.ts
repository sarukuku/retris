import { formatSeconds } from "./format-seconds"

const tests = [
  {
    input: 0,
    output: "00:00",
  },
  {
    input: 5,
    output: "00:05",
  },
  {
    input: 59,
    output: "00:59",
  },
  {
    input: 60,
    output: "01:00",
  },
  {
    input: 181,
    output: "03:01",
  },
]

tests.map(({ input, output }) => {
  test(`format ${input} seconds to be "${output}"`, () => {
    expect(formatSeconds(input)).toEqual(output)
  })
})

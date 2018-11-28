import { formatScore } from "./format-score"

const tests = [
  {
    input: 0,
    output: "0",
  },
  {
    input: 1000,
    output: "1,000",
  },
  {
    input: 99999,
    output: "99,999",
  },
  {
    input: 1000000,
    output: "1,000,000",
  },
  {
    input: 32000000,
    output: "32,000,000",
  },
]

tests.map(({ input, output }) => {
  test(`format ${input} score to be "${output}"`, () => {
    expect(formatScore(input)).toEqual(output)
  })
})

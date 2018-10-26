import { Shape } from "./shape"

const _ = undefined
const color = "red"
const x = { color }

const tests = [
  {
    name: "I shape",
    createShape: Shape.createIShape,
    initial: [
      [_, _, x, _], //
      [_, _, x, _],
      [_, _, x, _],
      [_, _, x, _],
    ],
    rotateOnce: [
      [_, _, _, _], //
      [_, _, _, _],
      [x, x, x, x],
      [_, _, _, _],
    ],
    rotateTwice: [
      [_, _, x, _], //
      [_, _, x, _],
      [_, _, x, _],
      [_, _, x, _],
    ],
    rotateThrice: [
      [_, _, _, _], //
      [_, _, _, _],
      [x, x, x, x],
      [_, _, _, _],
    ],
  },
  {
    name: "J shape",
    createShape: Shape.createJShape,
    initial: [
      [_, x, _], //
      [_, x, _],
      [x, x, _],
    ],
    rotateOnce: [
      [x, _, _], //
      [x, x, x],
      [_, _, _],
    ],
    rotateTwice: [
      [_, x, x], //
      [_, x, _],
      [_, x, _],
    ],
    rotateThrice: [
      [_, _, _], //
      [x, x, x],
      [_, _, x],
    ],
  },
  {
    name: "L shape",
    createShape: Shape.createLShape,
    initial: [
      [_, x, _], //
      [_, x, _],
      [_, x, x],
    ],
    rotateOnce: [
      [_, _, _], //
      [x, x, x],
      [x, _, _],
    ],
    rotateTwice: [
      [x, x, _], //
      [_, x, _],
      [_, x, _],
    ],
    rotateThrice: [
      [_, _, x], //
      [x, x, x],
      [_, _, _],
    ],
  },
  {
    name: "O shape",
    createShape: Shape.createOShape,
    initial: [
      [x, x], //
      [x, x],
    ],
    rotateOnce: [
      [x, x], //
      [x, x],
    ],
    rotateTwice: [
      [x, x], //
      [x, x],
    ],
    rotateThrice: [
      [x, x], //
      [x, x],
    ],
  },
  {
    name: "S shape",
    createShape: Shape.createSShape,
    initial: [
      [_, x, x], //
      [x, x, _],
      [_, _, _],
    ],
    rotateOnce: [
      [_, x, _], //
      [_, x, x],
      [_, _, x],
    ],
    rotateTwice: [
      [_, _, _], //
      [_, x, x],
      [x, x, _],
    ],
    rotateThrice: [
      [x, _, _], //
      [x, x, _],
      [_, x, _],
    ],
  },
  {
    name: "T shape",
    createShape: Shape.createTShape,
    initial: [
      [_, x, _], //
      [x, x, x],
      [_, _, _],
    ],
    rotateOnce: [
      [_, x, _], //
      [_, x, x],
      [_, x, _],
    ],
    rotateTwice: [
      [_, _, _], //
      [x, x, x],
      [_, x, _],
    ],
    rotateThrice: [
      [_, x, _], //
      [x, x, _],
      [_, x, _],
    ],
  },
  {
    name: "Z shape",
    createShape: Shape.createZShape,
    initial: [
      [x, x, _], //
      [_, x, x],
      [_, _, _],
    ],
    rotateOnce: [
      [_, _, x], //
      [_, x, x],
      [_, x, _],
    ],
    rotateTwice: [
      [_, _, _], //
      [x, x, _],
      [_, x, x],
    ],
    rotateThrice: [
      [_, x, _], //
      [x, x, _],
      [x, _, _],
    ],
  },
]

tests.map(
  ({ name, createShape, initial, rotateOnce, rotateTwice, rotateThrice }) => {
    test(`${name} initial`, () => {
      const shape = createShape(color)

      expect(shape.matrix).toEqual(initial)
    })

    test(`${name} rotateOnce`, () => {
      const shape = createShape(color)

      shape.rotate()

      expect(shape.matrix).toEqual(rotateOnce)
    })

    test(`${name} rotateTwice`, () => {
      const shape = createShape(color)

      shape.rotate()
      shape.rotate()

      expect(shape.matrix).toEqual(rotateTwice)
    })

    test(`${name} rotateThrice`, () => {
      const shape = createShape(color)

      shape.rotate()
      shape.rotate()
      shape.rotate()

      expect(shape.matrix).toEqual(rotateThrice)
    })
  },
)

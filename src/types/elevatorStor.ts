export interface IElevators {
  down: boolean
  id: number
  inMove: boolean
  level: number
  ready: boolean
  rest: boolean
  tasks: Array<number>
  up: boolean
}

export interface ILevels {
  id: number
  pressed: boolean
}

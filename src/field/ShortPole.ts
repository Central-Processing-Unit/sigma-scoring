import Pole from "./Pole"

export default class ShortPole extends Pole {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'short')
  }
}

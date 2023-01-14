import Pole from "./Pole"

export default class TallPole extends Pole {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'tall')
  }
}

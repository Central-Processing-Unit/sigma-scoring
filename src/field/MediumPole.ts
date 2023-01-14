import Pole from "./Pole"

export default class MediumPole extends Pole {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'medium')
  }
}

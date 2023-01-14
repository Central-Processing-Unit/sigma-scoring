import Junction from "./Junction"

export default class TallPole extends Junction {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'tall')
  }
}

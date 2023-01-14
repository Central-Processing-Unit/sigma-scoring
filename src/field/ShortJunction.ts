import Junction from "./Junction"

export default class ShortJunction extends Junction {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'short')
  }
}

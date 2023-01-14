import Junction from "./Junction";

export default class GroundJunction extends Junction {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'ground', 20)
  }
}

import Junction from './Junction'

export default class HighJunction extends Junction {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'high')
  }
}

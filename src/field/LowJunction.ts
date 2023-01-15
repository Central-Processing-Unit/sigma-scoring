import Junction from './Junction'

export default class LowJunction extends Junction {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'low')
  }
}

import Junction from "./Junction"

export default class MediumPole extends Junction {
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x, y, canvas, 'medium')
  }
}

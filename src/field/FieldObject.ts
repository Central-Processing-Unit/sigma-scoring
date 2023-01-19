import { Scores } from '../types'

export default abstract class FieldObject {
  x: number
  y: number
  width: number
  height: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  hovering: boolean = false

  constructor(x: number, y: number, width: number, height: number, canvas: HTMLCanvasElement) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.canvas = canvas
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  }

  abstract render(): void

  abstract isPointWithin(x: number, y: number): boolean

  handleClick(e: MouseEvent): void {}

  setHovering(hovering: boolean): void {
    this.hovering = hovering
  }

  getScores(): Scores {
    return { blue: 0, red: 0 }
  }

  endAutonomous(): void {}
}

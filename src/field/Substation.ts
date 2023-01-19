import drawRotatedRect from '../drawRotatedRect'
import { Scores, TeamColor } from '../types'
import FieldObject from './FieldObject'

export default class Substation extends FieldObject {
  color: TeamColor
  lastClicked: number = 0
  lastDeleted: number = 0
  parks: number = 0
  isAuton = true

  constructor(x: number, y: number, canvas: HTMLCanvasElement, color: TeamColor) {
    super(x, y, 1000 / 12, 1000 / 6, canvas)
    this.color = color
  }

  render() {
    // Draw hover effect
    if (this.hovering) {
      this.ctx.fillStyle = this.hovering ? '#b5b3b3' : '#a1a1a1'
      this.ctx.beginPath()
      if (this.color === 'blue') {
        this.ctx.moveTo(this.x, this.y - 75)
        this.ctx.lineTo(this.x + this.width, this.y)
        this.ctx.lineTo(this.x, this.y + 75)
      } else {
        this.ctx.moveTo(this.x, this.y - 75)
        this.ctx.lineTo(this.x - this.width, this.y)
        this.ctx.lineTo(this.x, this.y + 75)
      }
      this.ctx.fill()
    }

    // Draw substation
    if (this.color === 'blue') {
      this.ctx.fillStyle = '#0a0ef2'
      this.ctx.strokeStyle = '#0a0a75'
      drawRotatedRect(this.ctx, 30, 398, 15, 125, -45)
      drawRotatedRect(this.ctx, 30, 480, 15, 125, 45)
      drawRotatedRect(this.ctx, 35, 402, 10, 120, -45, false)
    } else {
      this.ctx.fillStyle = '#fe0f0a'
      this.ctx.strokeStyle = '#500910'
      drawRotatedRect(this.ctx, 954, 396, 15, 125, 45)
      drawRotatedRect(this.ctx, 954, 478, 15, 130, -45)
      drawRotatedRect(this.ctx, 954, 402, 10, 120, 45, false)
    }

    // Parks
    for (let i = 0; i < this.parks; i++) {
      const py = 470 + 45 * i
      this.ctx.fillRect(this.color === 'blue' ? 10 : 975, py, 15, 15)
      this.ctx.strokeRect(this.color === 'blue' ? 10 : 975, py, 15, 15)
    }

    // Replace line
    this.ctx.fillStyle = '#3e3e3e'
    this.ctx.strokeStyle = '#73722c'
    this.ctx.fillRect(this.x - (this.color === 'red' ? this.width + 25 : 0), this.y - 3, this.width + 25, 6)
  }

  isPointWithin(x: number, y: number): boolean {
    if (!this.isAuton) {
      return false
    }
    const xDist = Math.abs(x - this.x)
    const yDist = Math.abs(y - this.y)
    // let xCornerDist = this.color === 'blue' ? x - this.x : this.x + this.width - x
    // let yCornerDist = this.isTop ? y - this.y : this.y + this.height - y
    // return xCornerDist + yCornerDist <= this.width
    return xDist + yDist <= this.width
  }

  handleClick(e: MouseEvent): void {
    if (!this.isAuton) {
      return
    }
    if (e.ctrlKey) {
      if (this.parks > 0) {
        this.parks--
      }
    } else if (this.parks < 2) {
      this.parks++
    }
  }

  override getScores(): Scores {
    const points = { blue: 0, red: 0 } as Scores
    points[this.color] += this.parks * 2
    return points
  }

  override endAutonomous(): void {
    this.parks = 0
    this.isAuton = false
  }
}

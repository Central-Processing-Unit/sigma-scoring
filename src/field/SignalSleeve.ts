import { Scores, TeamColor } from '../types'
import FieldObject from './FieldObject'

const radius = 15

class SignalSleeve extends FieldObject {
  color: TeamColor
  isCustom: boolean
  isParked: boolean = false
  isAutonomous = true

  constructor(x: number, y: number, canvas: HTMLCanvasElement, color: TeamColor, isCustom: boolean = true) {
    super(x, y, radius, radius, canvas)
    this.color = color
    this.isCustom = isCustom
  }

  render(): void {
    if (this.color === 'blue') {
      this.ctx.fillStyle = this.hovering ? '#4e51f5' : '#0a0ef2'
      this.ctx.strokeStyle = '#0a0a75'
    } else if (this.color === 'red') {
      this.ctx.fillStyle = this.hovering ? '#f54340' : '#fe0f0a'
      this.ctx.strokeStyle = '#500910'
    }
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false)
    this.ctx.fill()
    this.ctx.lineWidth = 5
    if (this.isCustom) {
      this.ctx.stroke()
    }

    this.ctx.fillStyle = this.isParked ? 'lime' : this.ctx.strokeStyle
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false)
    this.ctx.fill()
  }

  override isPointWithin(x: number, y: number): boolean {
    return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) < Math.pow(this.width + 15, 2)
  }

  // todo: alt click to change sleeve status
  override handleClick(e: MouseEvent): void {
    if (e.altKey) {
      this.isCustom = !this.isCustom
    } else if (e.ctrlKey) {
      this.isParked = false
    } else {
      this.isParked = true
    }
  }

  override getScores(): Scores {
    if (!this.isParked || !this.isAutonomous) {
      return { blue: 0, red: 0 }
    }
    const value = this.isCustom ? 20 : 10
    return {
      blue: this.color === 'blue' ? value : 0,
      red: this.color === 'red' ? value : 0
    }
  }

  override endAutonomous(): void {
    this.isAutonomous = false
  }
}

export default SignalSleeve
